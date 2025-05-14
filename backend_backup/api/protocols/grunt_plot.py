from fpdf import FontFace


class GruntPlotPDF:
    def __init__(self, pdf):
        self.pdf = pdf

    def generate(self):
        pdf = self.pdf
        style = FontFace(fill_color=(245, 245, 245), emphasis="B", size_pt=9)

        pdf.set_font("dejavu", "B", 10)
        pdf.cell(0, 10, 'ПРОТОКОЛ ИСПЫТАНИЙ № SB – 155 от 17.03.2025 г.', align='C', ln=1)
        pdf.cell(0, 0, 'TEST REPORT № SB – 155 from 17.03.2025 y.', align='C', ln=True)

        pdf.ln(5)

        TABLE_DATA = [
            ['Наименование заказчика\nCustomer name', 'ООО «MAXSUS SUV QURILISH INVEST»'],
            ['Наименование объекта\nObject name',
             'Реконструкция и новое строительство Водозаборных сооружений и насосных станций 1; 2 и 3 подъемов» в рамках проекта Модернизации систем водоснабжения водоотведения и дорожной сети г. Самарканда.'],
            ['Наименование продукции\nProduct name', 'Суглинистый грунт'],
            ['Обозначение и данные маркировки объекта испытаний\nDesignation and marking data of the test object',
             'Основание из уплотненного грунта, Дом 4,2'],
            ['Наименование изготовителя\nManufacturer’s name', '-'],
            ['Вид испытания\nType of test', 'Периодическое испытание\nPeriodic test'],
            ['НД на объекты испытаний\nRD on test object',
             'РП объекта строительства'],
            ['НД на методы испытаний\nRD on testing methods', 'ГОСТ 5180-2015'],
            ['Дополнения, отклонения или исключения из метода\nAdditions, deviations or exceptions to the method', '-'],
            ['Испытания, проведенные субподрядчиком\nTests carried out by subcontractor', 'Не проводились\nNot tested'],
            ['Дата начала испытания\nTest start date', '17.03.2025 г'],
            ['Дата завершения испытания\nTest completion date', '17.03.2025 г'],
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
        pdf.cell(0, 11, 'Условия окружающей среды / Environmental conditions', align='L', ln=1)

        TABLE_DATA = [
            ['Температура / Temperature', '20-22 °С'],
            ['Относительная влажность / Relative humidity', '50-55 %'],
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
                       'При испытании использовались следующие приборы и средства измерений / Following instruments and measuring tools were used during the testing',
                       align='L', ln=1)

        pdf.ln(3)

        TABLE_DATA = [
            ['Наименование\nName', '№ сертификата\nCertificate No.', 'Дата выдачи\nDate of issue'],
            ['Сушильный шкаф', '1054555', '07.06.2024'],
            ['Весы электронные CAS MWP 3000H', 'GCC/M-181-2024', '13.05.2024'],
            ['Режущее кольцо', '396740001', '16.05.2024'],
            ['Психрометр аспирационный', '1111030-2024', '20.08.2024'],

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

        pdf.ln(5)

        pdf.set_font("dejavu", "B", 11)
        pdf.cell(0, 11, 'Результаты испытаний / Test results', align='C', ln=1)

        TABLE_DATA = [
            [
                '№',
                'Место отбора проб\nSampling location',
                'Плотность грунта во влажном состоянии\nSoil density in wet state,\ng/сm3',
                'Влажность\nHumidity\n%',
                'Плотность  грунта в сухом состоянии\nSoil density in dry state,\ng/сm3',
                'Требование по проекту\nProject requirement',
                'Выводы\nConclusions'
            ],
            [
                '1',
                'Точка №1, 1-слой ',
                '1.90',
                '14.2',
                '1.66',
                '1.65',
                'соот-ет'
            ],
            [
                '2',
                'Точка №2, 2-слой',
                '1.90',
                '14.2',
                '1.66',
                '1.65',
                'соот-ет'
            ],

        ]

        pdf.set_font("dejavu", "", 9)
        with pdf.table(
                first_row_as_headings=True,
                headings_style=FontFace(fill_color=(245, 245, 245), emphasis="B", size_pt=9),
                text_align="L",
                line_height=5,
                col_widths=[10, 42, 30, 25, 28, 27, 23],
                padding=(1, 2, 1, 2)
        ) as table:
            i = 0
            for data in TABLE_DATA:
                row = table.row()
                align = "C"  # heading is center, others are left
                row.cell(data[0], align=align)
                row.cell(data[1], align=align)
                row.cell(data[2], align=align)
                row.cell(data[3], align=align)
                row.cell(data[4], align=align)
                row.cell(data[5], align=align)
                row.cell(data[6], align=align)
                i = i + 1

        pdf.ln(5)

        pdf.set_font("dejavu", "B", 11)
        pdf.cell(0, 11, 'Примечание / Note', align='L', ln=1)
        pdf.set_font("dejavu", "", 9)
        primechanie = 'Фактический класс прочности бетона рассчитывается по схеме Г по ГОСТ 18105-2018 «Бетоны. Правила контроля и оценки прочности».'
        pdf.multi_cell(w=190, h=5, txt=primechanie, border=1, padding=2)
