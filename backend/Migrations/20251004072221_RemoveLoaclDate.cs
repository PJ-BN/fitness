using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fitness.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLoaclDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_IntakeEntries_UserId_LocalDate",
                table: "IntakeEntries");

            migrationBuilder.DropColumn(
                name: "LocalDate",
                table: "IntakeEntries");

            migrationBuilder.CreateIndex(
                name: "IX_IntakeEntries_UserId",
                table: "IntakeEntries",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_IntakeEntries_UserId",
                table: "IntakeEntries");

            migrationBuilder.AddColumn<DateOnly>(
                name: "LocalDate",
                table: "IntakeEntries",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.CreateIndex(
                name: "IX_IntakeEntries_UserId_LocalDate",
                table: "IntakeEntries",
                columns: new[] { "UserId", "LocalDate" });
        }
    }
}
