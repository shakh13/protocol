import json

from django.db.models.functions import TruncQuarter
from django.shortcuts import render
from django.template.defaultfilters import slice_filter
from datetime import datetime
from knox.serializers import UserSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from knox.models import AuthToken
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from six import text_type

from .protocols.beton_08 import Beton08PDF
from .protocols.beton_128 import Beton128PDF
from .protocols.cement import CementPDF
from .protocols.generate import generate
from .protocols.gps_kup import GPSKupPDF
from .protocols.gps_plot import GPSPlotPDF
from .protocols.gps_shps import GPSSHPSPDF
from .protocols.grunt_kup import GruntKupPDF
from .protocols.grunt_plot import GruntPlotPDF
from .protocols.max_plot import MaxPlotPDF
from .protocols.onix_shmidt import OnixShmidtPDF
from .protocols.onix_shmidt_128 import OnixShmidt128PDF
from .protocols.pesok import PesokPDF
from .protocols.plt import PltPDF
from .protocols.sheben import ShebenPDF
from .serializers import *
from .models import *

from django.shortcuts import get_object_or_404

from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

import os
from django.conf import settings

from .models import PROTOCOL_TYPES

import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, PageTemplate
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib import colors
from reportlab.pdfgen import canvas

User = get_user_model()

from django.http import FileResponse
from django.http import HttpResponse

from fpdf import FPDF, FontFace
from fpdf.enums import Align, TableSpan

from qrcode_styled.pil.image import PilStyledImage
import qrcode_styled


def qr_generator(data):
    qr = qrcode_styled.QRCodeStyled(
        version=None,
        error_correction=qrcode_styled.ERROR_CORRECT_L,
        box_size=30,
        border=1,
        image_factory=PilStyledImage,
        mask_pattern=None,
    )

    qr_img = qr.get_image(  # Payload. Required
        data=data,
        # Image to put in the middle of QRCode. file handler.
        image=None,
        # Data encoding optimization level, not Image optimization.
        optimize=20,
    )
    img_io = io.BytesIO()
    qr_img.save(img_io, "WEBP", quality=90)
    img_io.seek(0)
    return img_io


def generate_protocol_pdf(request, pk):
    p = Protocol.objects.get(pk=pk)
    if not p or p.status == 0:  # Check if exists or completed
        return Response({"error": "Protocol not found"}, status=status.HTTP_404_NOT_FOUND)

    protocol = ProtocolSerializer(p, many=False).data

    class PDF(FPDF):
        def __init__(self, **kwargs):
            super(PDF, self).__init__(**kwargs)
            self.add_font("dejavu", "", r"api/font/DejaVuSerif.ttf", uni=True)
            self.add_font("dejavu", "B", r"api/font/DejaVuSerif-Bold.ttf", uni=True)
            self.add_font("dejavu", "I", r"api/font/DejaVuSerif-Italic.ttf", uni=True)
            self.add_font("dejavu", "BI", r"api/font/DejaVuSerif-BoldItalic.ttf", uni=True)

        def footer(self):
            self.set_y(-17)
            self.set_font('dejavu', 'I', 10)

            self.cell(
                0,
                5,
                f'Протокол испытаний № {protocol["building"]["prefix"] + " - " if protocol["building"] else ""}{protocol["id"]} от 17.03.2025 г.',
                ln=1,
                align='C'
            )
            self.cell(
                0,
                5,
                f'Общие количество страниц в протоколе испытаний - {{nb}}, страница - {self.page_no()}',
                ln=1,
                align='C'
            )

    buffer = io.BytesIO()

    pdf = PDF(orientation='p', unit='mm', format='A4')

    pdf.alias_nb_pages()
    pdf.title = f'Протокол № {protocol["building"]["prefix"] + " - " if protocol["building"] else ""}{protocol["id"]}'
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    # add protocol data here
    pdf.set_font("dejavu", "B", 10)
    pdf.cell(0, 5, "Научно-исследовательская и испытательная лаборатория", align='C', ln=True)
    pdf.cell(0, 5, protocol['laboratory']['name'], align='C', ln=True)
    if protocol['language'] == 'en':
        pdf.cell(0, 5, protocol['laboratory']['name_en'], align='C', ln=True)

    pdf.ln(4)

    style = FontFace(fill_color=(245, 245, 245), emphasis="B", size_pt=9)

    pdf.set_font("dejavu", "", 9)

    with pdf.table(text_align=("L", "L", "C"),
                   first_row_as_headings=False,
                   col_widths=[60, 98, 32],
                   line_height=5,
                   padding=(1, 2, 1, 2),
                   ) as table:
        row = table.row()
        row.cell(f"Адрес{' / Address' if protocol['language'] == 'en' else ''}", style=style)
        row.cell(
            f"{protocol['laboratory']['address']}{'/' + protocol['laboratory']['address_en'] if protocol['language'] == 'en' else ''}",
        )
        row.cell(img=qr_generator("https://rtc-test.uz/protocol-pdf/" + str(pk)), img_fill_width=False, rowspan=3)

        row = table.row()
        row.cell(f"Телефон{' / Phone' if protocol['language'] == 'en' else ''}", style=style)
        row.cell(protocol['laboratory']['phone'])

        row = table.row()
        row.cell("E-mail:", style=style)
        row.cell(protocol['laboratory']['email'])

    pdf.ln(4)

    with pdf.table(first_row_as_headings=False,
                   col_widths=[70, 120],
                   padding=(1, 2, 1, 2),
                   line_height=5,
                   ) as table:
        row = table.row()
        row.cell(f"Утверждаю{' / Approve' if protocol['language'] == 'en' else ''}", style=style)
        row.cell(
            f"Начальник лаборатории - {protocol['laboratory']['boss']}"
            + ('\nHead of the laboratory - ' +
               protocol['laboratory']['boss_en'] if
               protocol['language'] == 'en' else '')
        )
    pdf.ln(4)

    style = FontFace(fill_color=(245, 245, 245), emphasis="B", size_pt=9)

    pdf.set_font("dejavu", "B", 10)
    pdf.cell(0, 10,
             f'ПРОТОКОЛ ИСПЫТАНИЙ № {protocol["building"]["prefix"] + " - " if protocol["building"] else ""}{protocol["id"]} от {datetime.strptime(protocol["start_date"], "%Y-%m-%d").strftime("%d.%m.%Y")} г.',
             align='C', ln=1)
    if protocol['language'] == 'en':
        pdf.cell(0, 0,
                 f'TEST REPORT № {protocol["building"]["prefix"] + " - " if protocol["building"] else ""}{protocol["id"]} от {datetime.strptime(protocol["start_date"], "%Y-%m-%d").strftime("%d.%m.%Y")} y.',
                 align='C', ln=True)
        pdf.ln(5)
    if protocol['language'] == 'en':
        TABLE_DATA = [
            [
                'Наименование заказчика\nCustomer name',
                protocol['client']['name']
            ],
            [
                'Наименование объекта\nObject name',
                f"{protocol['building']['name'] if protocol['building'] else '-'}"
            ],
            [
                'Наименование продукции\nProduct name',
                f"{protocol['product_name']}\n{protocol['product_name_eng']}"
            ],
            [
                'Обозначение и данные маркировки объекта испытаний\nDesignation and marking data of the test object',
                f"{protocol['building_data']}\n{protocol['building_data_eng']}"
            ],
            [
                'Наименование изготовителя\nManufacturer’s name',
                f"{protocol['producer_name']}\n{protocol['producer_name_eng']}"
            ],
            [
                'Вид испытания\nType of test',
                f"{protocol['test_type']}\n{protocol['test_type_eng']}"
            ],
            [
                'НД на объекты испытаний\nRD on test object',
                f"{protocol['rd_test_building']}\n{protocol['rd_test_building_eng']}"
            ],
            [
                'НД на методы испытаний\nRD on testing methods',
                f"{protocol['rd_test_method']}\n{protocol['rd_test_method_eng']}"
            ],
            [
                'Дополнения, отклонения или исключения из метода\nAdditions, deviations or exceptions to the method',
                f"{protocol['addition']}\n{protocol['addition_eng']}"
            ],
            [
                'Испытания, проведенные субподрядчиком\nTests carried out by subcontractor',
                f"{protocol['subcontractor']}\n{protocol['subcontractor_eng']}"
            ],
            [
                'Дата начала испытания\nTest start date',
                f'{datetime.strptime(protocol["start_date"], "%Y-%m-%d").strftime("%d.%m.%Y")} г'
            ],
            [
                'Дата завершения испытания\nTest completion date',
                f'{datetime.strptime(protocol["end_date"], "%Y-%m-%d").strftime("%d.%m.%Y")} г'
            ],
        ]
    else:
        TABLE_DATA = [
            [
                'Наименование заказчика',
                protocol['client']['name']
            ],
            [
                'Наименование объекта',
                f"{protocol['building']['name'] if protocol['building'] else '-'}"
            ],
            [
                'Наименование продукции',
                protocol['product_name']
            ],
            [
                'Обозначение и данные маркировки объекта испытаний',
                protocol['building_data']
            ],
            [
                'Наименование изготовителя',
                protocol['producer_name']
            ],
            [
                'Вид испытания',
                protocol['test_type']
            ],
            [
                'НД на объекты испытаний',
                protocol['rd_test_building']
            ],
            [
                'НД на методы испытаний',
                protocol['rd_test_method']
            ],
            [
                'Дополнения, отклонения или исключения из метода',
                protocol['addition']
            ],
            [
                'Испытания, проведенные субподрядчиком',
                protocol['subcontractor']
            ],
            [
                'Дата начала испытания',
                f'{datetime.strptime(protocol["start_date"], "%Y-%m-%d").strftime("%d.%m.%Y")} г'
            ],
            [
                'Дата завершения испытания',
                f'{datetime.strptime(protocol["end_date"], "%Y-%m-%d").strftime("%d.%m.%Y")} г'
            ],
        ]

    pdf.set_font("dejavu", "", 9)
    with pdf.table(
            first_row_as_headings=False,
            text_align="L",
            line_height=5,
            col_widths=[70, 120],
            padding=(1, 2, 1, 2)
    ) as table:
        for data in TABLE_DATA:
            row = table.row()
            row.cell(data[0], style=style)
            row.cell(data[1])

    pdf.ln(5)

    pdf.set_font("dejavu", "B", 11)
    pdf.cell(0, 11, f"Условия окружающей среды{' / Environmental conditions' if protocol['language'] == 'en' else ''}",
             align='L', ln=1)

    TABLE_DATA = [
        [
            f"Температура{' / Temperature' if protocol['language'] == 'en' else ''}",
            f"{protocol['temperature_from']}-{protocol['temperature_to']} °С"
        ],
        [
            f"Относительная влажность{' / Relative humidity' if protocol['language'] == 'en' else ''}",
            f"{protocol['humidity_from']}-{protocol['humidity_to']} %"
        ],
    ]

    pdf.set_font("dejavu", "", 9)
    with pdf.table(
            first_row_as_headings=False,
            text_align="L",
            line_height=5,
            col_widths=[70, 120],
            padding=(1, 2, 1, 2)
    ) as table:
        for data in TABLE_DATA:
            row = table.row()
            row.cell(data[0], style=style)
            row.cell(data[1])

    pdf.ln(7)

    pdf.set_font("dejavu", "B", 11)
    pdf.multi_cell(0, 6,
                   f"При испытании использовались следующие приборы и средства измерений{' / Following instruments and measuring tools were used during the testing' if protocol['language'] == 'en' else ''}",
                   align='L', ln=1)

    pdf.ln(3)

    if protocol['language'] == 'en':
        TABLE_DATA = [
            [
                'Наименование\nName',
                '№ сертификата\nCertificate No.',
                'Дата выдачи\nDate of issue'
            ],
        ]
    else:
        TABLE_DATA = [
            [
                'Наименование',
                '№ сертификата',
                'Дата выдачи'
            ],
        ]
    for machine in protocol['machines']:
        TABLE_DATA.append([
            machine['name'],
            machine['certificate_number'],
            datetime.strptime(machine['certificate_expiry_date'], "%Y-%m-%d").strftime("%d.%m.%Y"),
        ])

    pdf.set_font("dejavu", "", 9)
    with pdf.table(
            first_row_as_headings=True,
            headings_style=FontFace(fill_color=(245, 245, 245), emphasis="B", size_pt=9),
            text_align="L",
            line_height=5,
            col_widths=[90, 60, 40],
            padding=(1, 2, 1, 2)
    ) as table:
        i = 0
        for data in TABLE_DATA:
            row = table.row()
            align = "C" if i == 0 else "L"  # heading is center, others are left
            row.cell(data[0], align=align)
            row.cell(data[1], align=align)
            row.cell(data[2], align=align)
            i = i + 1

    pdf.ln(5)

    data = json.loads(protocol['data'])

    if len(data) > 0:
        settings = json.loads(protocol['type']['settings'])
        TABLE_DATA = [
            settings['headers'],
        ]

        for i in range(0, len(settings['fields'])):
            row = []
            for j in range(0, len(settings['fields'][i])):
                if settings['fields'][i][j]['type'] == "i":
                    row.append(i + 1)
                elif settings['fields'][i][j]['type'] == "text":
                    row.append(settings['fields'][i][j]['label'])
                elif settings['fields'][i][j]['type'] in ["text_field", "textarea_field", "number_field"]:
                    if settings['fields'][i][j]['name'] in data:
                        row.append(data[settings['fields'][i][j]['name']])
                    else:
                        row.append("-")
                elif settings['fields'][i][j]['type'] == "date_field":
                    if settings['fields'][i][j]['name'] in data:
                        row.append(
                            datetime.strptime(data[settings['fields'][i][j]['name']], "%Y-%m-%d").strftime("%d.%m.%Y"))
                    else:
                        row.append("-")

            TABLE_DATA.append(row)

        pdf.set_font("dejavu", "B", 11)
        pdf.cell(0, 11, f"Результаты испытаний{' / Test results' if protocol['language'] == 'en' else ''}", align='C',
                 ln=1)

        pdf.set_font("dejavu", "", 9)

        with pdf.table(
                first_row_as_headings=True,
                headings_style=FontFace(fill_color=(245, 245, 245), emphasis="B", size_pt=9),
                text_align="L",
                line_height=5,
                col_widths=settings["col_widths"],
                padding=(1, 2, 1, 2)
        ) as table:
            for d in TABLE_DATA:
                row = table.row()
                for i in range(0, len(d)):
                    row.cell(str(d[i]), align="C")

    pdf.ln(4)

    TABLE_DATA = [
        [
            f"Испытатель{' / Tester' if protocol['language'] == 'en' else ''}",
            f"{protocol['user']['position']['name']} - {protocol['user']['fullname']}\n{protocol['user']['position']['name_en']} - {protocol['user']['fullname']}"
        ],
    ]

    pdf.set_font("dejavu", "", 9)
    with pdf.table(
            first_row_as_headings=False,
            text_align="L",
            line_height=5,
            col_widths=[70, 120],
            padding=(1, 2, 1, 2)
    ) as table:
        for data in TABLE_DATA:
            row = table.row()
            row.cell(data[0], style=style)
            row.cell(data[1])

    pdf.ln(4)

    pdf.set_font("dejavu", "I", 10)
    txt = (f"{protocol['laboratory']['protocol_ending']}" +
           (
               '\n' + protocol['laboratory']['protocol_ending_en'] if protocol['language'] == 'en' else ''
           ))
    pdf.multi_cell(w=190, h=5, txt=txt, padding=2, align="C")

    pdf.ln(4)

    y = pdf.get_y()

    pdf.set_draw_color(0, 0, 0)  # Set line color (black)
    pdf.line(50, y, 160, y)

    pdf.ln(4)

    pdf.set_font("dejavu", "I", 10)
    pdf.multi_cell(0, 5, "Конец протокола испытаний" + ('\nEnd of test report' if protocol['language'] == 'en' else ''),
                   align='C', ln=1)

    pdf.output(buffer, 'F')
    buffer.seek(0)

    # response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
    # response["Content-Disposition"] = 'inline; filename="protocol.pdf"'

    # return response
    return FileResponse(buffer, content_type='application/pdf')


class LaboratoryViewSet(viewsets.ModelViewSet):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Laboratory.objects.filter(id=self.request.user.laboratory.id)

    def retrieve(self, request, *args, **kwargs):
        laboratory = get_object_or_404(Laboratory, id=request.user.laboratory.id)
        serializer = self.get_serializer(laboratory)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Update laboratory: Keep previous image if no new one is provided"""
        laboratory = get_object_or_404(Laboratory, id=self.request.user.laboratory.id)

        # Get new file (if any)
        new_print = request.FILES.get('print', None)

        data = request.data.copy()
        if new_print:  # If no new file, keep the old one
            if laboratory.print:
                old_file_path = os.path.join(settings.MEDIA_ROOT, laboratory.print.name)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            data['print'] = new_print
        else:

            data['print'] = laboratory.print

        serializer = self.get_serializer(laboratory, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class PositionViewSet(viewsets.ModelViewSet):
    serializer_class = PositionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Position.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Position.objects.all()
        position = get_object_or_404(queryset, pk=self.kwargs['pk'])
        serializer = self.serializer_class(position)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Position, pk=self.kwargs['pk'])  # Get existing position
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        position = get_object_or_404(Position, pk=self.kwargs['pk'])
        position.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BuildingViewSet(viewsets.ModelViewSet):
    serializer_class = BuildingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Building.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Building.objects.all()
        building = get_object_or_404(queryset, pk=self.kwargs['pk'])
        protocols = ProtocolSerializer(Protocol.objects.filter(building=building).order_by('-id'), many=True)
        serializer = self.serializer_class(building)
        data = serializer.data
        data['protocols'] = protocols.data
        return Response(data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Building, pk=self.kwargs['pk'])  # Get existing building
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        building = get_object_or_404(Building, pk=self.kwargs['pk'])
        building.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["POST"])
    def remove_user(self, request, pk=None):
        building = get_object_or_404(Building, pk=pk)
        building.user = None  # ✅ Remove the user
        building.save()
        return Response({"message": "User removed from building"}, status=status.HTTP_200_OK)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.prefetch_related("buildings").all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Client.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Client.objects.all()
        client = get_object_or_404(queryset, pk=self.kwargs['pk'])
        protocols = ProtocolSerializer(Protocol.objects.filter(client=client).order_by('-id'), many=True)
        serializer = self.serializer_class(client)
        data = serializer.data
        data['protocols'] = protocols.data
        return Response(data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Client, pk=self.kwargs['pk'])  # Get existing client
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        client = get_object_or_404(Client, pk=self.kwargs['pk'])
        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MachineViewSet(viewsets.ModelViewSet):
    serializer_class = MachinesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Machines.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Machines.objects.all()
        machine = get_object_or_404(queryset, pk=self.kwargs['pk'])
        serializer = self.serializer_class(machine)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        machine = get_object_or_404(Machines, pk=self.kwargs['pk'])  # Get existing machine
        certificate_id = request.data.get('certificate')  # Expecting certificate ID
        if certificate_id:
            certificate = get_object_or_404(Certificate, pk=certificate_id)
            machine.certificate = certificate
            machine.save()
        serializer = self.serializer_class(machine, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        machine = get_object_or_404(Machines, pk=self.kwargs['pk'])
        machine.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CertificateViewSet(viewsets.ModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Certificate.objects.filter(laboratory=user.laboratory)

    def retrieve(self, request, *args, **kwargs):
        queryset = Certificate.objects.all()
        certificate = get_object_or_404(queryset, pk=self.kwargs['pk'])
        serializer = self.serializer_class(certificate)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        instance = get_object_or_404(Certificate, pk=self.kwargs['pk'])  # Get existing certificate
        serializer = self.serializer_class(instance, data=request.data, partial=True)  # Full update
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def partial_update(self, request, *args, **kwargs):
        request.data['laboratory'] = request.user.laboratory.id
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        certificate = get_object_or_404(Certificate, pk=self.kwargs['pk'])
        certificate.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(viewsets.ViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def retrieve(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        serializer = self.serializer_class(user)
        return Response(serializer.data)

    def list(self, request):
        current_user = request.user
        queryset = User.objects.filter(
            laboratory_id=current_user.laboratory_id  # ✅ Same laboratory
        ).exclude(id=current_user.id)  # ✅ Exclude current user

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, pk=None):
        password = request.data.pop('password', None)
        position_id = request.data.pop('position', None)
        user = User.objects.get(pk=pk)

        if position_id:
            try:
                user.position = Position.objects.get(id=position_id)  # Fetch Position instance
            except Position.DoesNotExist:
                raise serializers.ValidationError({"position": "Invalid position ID."})

        serializer = self.serializer_class(user, data=request.data, partial=True)

        if password:
            user.set_password(password)
        user.save()

        if serializer.is_valid():  # Full update
            serializer.save()
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)

    def destroy(self, request, *args, **kwargs):
        user = get_object_or_404(User, pk=self.kwargs['pk'])
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['POST'], url_path='add_client')
    def add_client(self, request, pk=None):
        """
        Add a client to the user's client list (ManyToMany field).
        """
        user = get_object_or_404(CustomUser, pk=pk)
        client_id = request.data.get("client_id")

        if not client_id:
            return Response({"detail": "Client ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = Client.objects.get(id=client_id)
        except Client.DoesNotExist:
            return Response({"detail": "Client not found."}, status=status.HTTP_404_NOT_FOUND)

        # Add client to the user's client list (without duplication)
        user.clients.add(client)

        return Response({"detail": f"Client {client.id} added to user {user.id}."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['POST'], url_path='remove-client')
    def remove_client(self, request, pk=None):
        user = get_object_or_404(CustomUser, pk=pk)
        client_id = request.data.get("client_id")

        if not client_id:
            return Response({"detail": "Client ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = Client.objects.get(id=client_id)
        except Client.DoesNotExist:
            return Response({"detail": "Client not found."}, status=status.HTTP_404_NOT_FOUND)

        # Remove client from the user's clients list
        user.clients.remove(client)

        return Response({"detail": f"Client {client.id} removed from user {user.id}."}, status=status.HTTP_200_OK)


class Me(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = LoginSerializer

    def get(self, request):
        user = request.user

        # Serialize laboratory
        laboratory = LaboratorySerializer(user.laboratory)

        # Get clients related to the current user
        clients = ClientSerializer(user.clients.all(), many=True).data

        # Get buildings where user is assigned
        buildings = BuildingSerializer(Building.objects.filter(user=user), many=True).data

        # Protocols
        protocols = ProtocolSerializer(Protocol.objects.filter(user=user).order_by("-id"), many=True).data

        return Response({
            'id': user.id,
            'laboratory': laboratory.data,
            'fullname': f"{user.first_name} {user.last_name}".strip(),
            'email': user.email,
            'isAdmin': user.is_superuser,
            'clients': clients,  # List of clients
            'buildings': buildings,
            'protocols': protocols,
        })


class LoginViewSet(viewsets.ViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            if user:
                _, token = AuthToken.objects.create(user)

                return Response(
                    {
                        "user": self.serializer_class(user).data,
                        "fullname": f"{user.first_name} {user.last_name}",
                        "token": token,
                        "isAdmin": user.is_superuser,
                    }
                )
            else:
                return Response({"error": "Invalid credentials"}, status=401)
        else:
            return Response(serializer.errors, status=400)


class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RegisterSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data, context={"request": request})  # Pass request in context
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    sitelink = "http://localhost/"
    token = "{}".format(reset_password_token.key)
    full_link = str(sitelink) + str("password-reset/") + str(token)
    print(token)
    print(full_link)

    context = {
        'full_link': full_link,
        'email_adress': reset_password_token.user.email
    }

    html_message = render_to_string("backend/email.html", context=context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject="Request for resetting password for {title}".format(title=reset_password_token.user.email),
        body=plain_message,
        from_email="vip.shaxi@gmail.com",
        to=[reset_password_token.user.email]
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()


@api_view(['GET'])
def get_protocol_types(request):
    protocol_types = ProtocolTypeSerializer(ProtocolType.objects.all(), many=True).data
    return Response(protocol_types)
    # return Response([{"value": item[0], "label": item[1]} for item in PROTOCOL_TYPES])


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_protocol(request):
    protocol = str(json.dumps(request.data['protocol']))

    request.data['laboratory_id'] = request.user.laboratory.id
    request.data['user_id'] = request.user.id
    request.data['data'] = protocol
    request.data['status'] = 0

    serializer = ProtocolSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    print(serializer.errors)
    return Response({'error': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_protocol(request, pk):
    protocol_serializer = ProtocolSerializer(Protocol.objects.get(id=pk))
    return Response(protocol_serializer.data)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_protocol(request, pk):
    try:
        protocol = Protocol.objects.get(id=pk)
        protocol.delete()
        return Response(status=204)
    except Protocol.DoesNotExist:
        return Response(status=404)


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_protocol_status(request, pk):
    try:
        protocol = Protocol.objects.get(id=pk)
        protocol.status = request.data['status']
        protocol.save()
        return Response(status=204)
    except Protocol.DoesNotExist:
        return Response(status=404)


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_protocol(request, pk):
    try:
        protocol_instance = Protocol.objects.get(pk=pk)
    except Protocol.DoesNotExist:
        return Response({"error": "Протокол не найдено"}, status=404)

    protocol_data = str(json.dumps(request.data.get('protocol', {})))
    request.data['data'] = protocol_data

    # Ensure lab is consistent with the logged-in user
    request.data['laboratory_id'] = request.user.laboratory.id
    request.data['status'] = 0

    machine_ids = request.data.pop('machines', None)
    serializer = ProtocolSerializer(instance=protocol_instance, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        if machine_ids is not None:
            protocol_instance.machines.set(machine_ids)
        return Response(serializer.data, status=200)

    print(serializer.errors)

    return Response({'error': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_edit_protocol_requests(request):
    serializer = ProtocolSerializer(Protocol.objects.filter(status=2, laboratory=request.user.laboratory), many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_protocols(request, pk):
    serializer = ProtocolSerializer(Protocol.objects.filter(user__id=pk).order_by('-id'), many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_all_protocols(request):
    serializer = ProtocolSerializer(Protocol.objects.filter(laboratory=request.user.laboratory).order_by('-id'),
                                    many=True)
    return Response(serializer.data)
