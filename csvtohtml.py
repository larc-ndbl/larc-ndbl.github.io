#!/usr/bin/env python3

import csv
import sys


def create_table_row(row, header):
    """Creates a single HTML table row string."""

    html_row = f"        <tr id='{row[7]}'>\n"  # Row ID is ISBN

    for i, cell in enumerate(row):
        if header[i] == "Book Title":
            html_row += f"            <td><span class='book-title mobile-title'>{cell}</span></td>\n"
        elif header[i] == "Author":
            html_row += f"            <td class='desktop-only'>{cell}</td>\n"
        elif header[i] == "Key themes":
            themes = cell.split(",")
            html_row += "            <td class='desktop-only'><ul class='theme-list'>\n"
            for theme in themes:
                html_row += f"                <li>{theme.strip()}</li>\n"
            html_row += "            </ul></td>\n"
        elif header[i] == "Description":
            html_row += f"            <td class='desktop-only'><span class='description'>{cell}</span></td>\n"
        elif header[i] == "ISBN":
            if cell:
                html_row += f"            <td><a href='https://isbnsearch.org/isbn/{cell}' target='_blank' class='mobile-isbn'>{cell}</a></td>\n"
            else:
                html_row += "            <td></td>\n"
        elif header[i] == "Target Age":
            if cell:
                html_row += (
                    "            <td class='desktop-only'><ul class='theme-list'>\n"
                )
                html_row += f"                <li>{cell.strip()}</li>\n"
                html_row += "            </ul></td>\n"
            else:
                html_row += "            <td></td>\n"
        elif header[i] not in ["Top 10", "For therapists", "Genre", "Amazon Price"]:
            pass

    html_row += "        </tr>\n"
    return html_row


def csv_to_html_table(csv_file_path):
    """
    Converts a CSV file to an HTML table string with classes.

    Args:
        csv_file_path: The path to the input CSV file.

    Returns:
        A string containing the HTML table.
    """

    try:
        with open(csv_file_path, "r", encoding="utf-8") as csvfile:
            reader = csv.reader(csvfile)
            header = next(reader)  # Get the header row

            html_table = "<table>\n"
            html_table += "    <thead>\n        <tr>\n"

            for col in header:
                if col not in ["Top 10", "For therapists", "Genre", "Amazon Price"]:
                    if col == "Book Title":
                        html_table += (
                            f"            <th class='mobile-title'>Title</th>\n"
                        )
                    elif col == "ISBN":
                        html_table += f"            <th class='mobile-isbn'>ISBN</th>\n"
                    else:
                        html_table += (
                            f"            <th class='desktop-only'>{col}</th>\n"
                        )

            html_table += "        </tr>\n    </thead>\n    <tbody>\n"

            for row in reader:
                html_table += create_table_row(row, header)

            html_table += "    </tbody>\n</table>"

            return html_table

    except FileNotFoundError:
        return f"Error: File not found at {csv_file_path}"
    except Exception as e:
        return f"An error occurred: {e}"


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <csv_file_path>")
    else:
        csv_file = sys.argv[1]
        html_table = csv_to_html_table(csv_file)
        print(html_table)
