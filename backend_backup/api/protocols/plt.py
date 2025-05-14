from fpdf import FontFace


class PltPDF:
    def __init__(self, pdf):
        self.pdf = pdf

    def generate(self):
        pdf = self.pdf
        style = FontFace(fill_color=(245, 245, 245), emphasis="B", size_pt=9)

        pdf.set_font("dejavu", "B", 10)
        pdf.cell(0, 7, 'ПРОТОКОЛ ИСПЫТАНИЙ № SB – 155 от 17.03.2025 г.', align='C', ln=1)
        pdf.cell(0, 0, 'TEST REPORT № SB – 155 from 17.03.2025 y.', align='C', ln=True)

        pdf.ln(4)

        TABLE_DATA = [
            [
                'Наименование заказчика\nCustomer name',
                'ООО «MAXSUS SUV QURILISH INVEST»'
            ],
            [
                'Наименование объекта\nObject name',
                'Реконструкция и новое строительство Водозаборных сооружений и насосных станций 1; 2 и 3 подъемов» в рамках проекта Модернизации систем водоснабжения водоотведения и дорожной сети г. Самарканда.'
            ],
            [
                'Наименование продукции\nProduct name',
                'Гравийно-песчаная смесь номер С4.'
            ],
            [
                'Обозначение и данные маркировки объекта испытаний\nDesignation and marking data of the test object',
                'Образцы представлени заказчиком 10.03.2025 г.'
            ],
            [
                'Наименование изготовителя\nManufacturer’s name',
                'ООО JASUR'
            ],
            [
                'Вид испытания\nType of test',
                'Периодическое испытание\nPeriodic test'
            ],
            [
                'НД на объекты испытаний\nRD on test object',
                '-'
            ],
            [
                'НД на методы испытаний\nRD on testing methods',
                'ГОСТ 20276.1-2020'
            ],
            [
                'Дополнения, отклонения или исключения из метода\nAdditions, deviations or exceptions to the method',
                '-'
            ],
            [
                'Испытания, проведенные субподрядчиком\nTests carried out by subcontractor',
                'Не проводились\nNot tested'
            ],
            [
                'Дата начала испытания\nTest start date',
                '17.03.2025 г'
            ],
            [
                'Дата завершения испытания\nTest completion date',
                '17.03.2025 г'
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

        pdf.set_font("dejavu", "B", 11)
        pdf.cell(0, 11, 'Условия окружающей среды / Environmental conditions', align='L', ln=1)

        TABLE_DATA = [
            ['Температура / Temperature', '21-22 °С'],
            ['Относительная влажность / Relative humidity', '-'],
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
        pdf.multi_cell(0, 6,
                       'При испытании использовались следующие приборы и средства измерений / Following instruments and measuring tools were used during the testing',
                       align='L', ln=1)

        pdf.ln(3)

        TABLE_DATA = [
            ['Наименование\nName', '№ сертификата\nCertificate No.', 'Дата выдачи\nDate of issue'],
            ['Манометр', '1054555', '07.06.2024'],
            ['Индикатор 777', 'GCC/M-181-2024', '13.05.2024'],
            ['Психрометр аспирационный', 'UZ-06/2061-2024', '16.05.2024'],
        ]

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
