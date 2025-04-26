from fpdf import FontFace


def generate(pdf, settings, data):
    pdf.set_font("dejavu", "", 9)

    table_data = [settings["headers"]] + data

    with pdf.table(
            first_row_as_headings=True,
            headings_style=FontFace(fill_color=(245, 245, 245), emphasis="B", size_pt=9),
            text_align="L",
            line_height=5,
            col_widths=settings["col_widths"],
            padding=(1, 2, 1, 2)
    ) as table:
        r = 0
        for d in table_data:
            row = table.row()
            align = "C"  # heading is center, others are left

            for i in range(0, len(d)):
                if r > 0:
                    row.cell(f'{r}' if settings["fields"][r - 1][i]["type"] == "i" else d[i], align=align)
                else:
                    row.cell(d[i], align=align)

            r = r + 1
