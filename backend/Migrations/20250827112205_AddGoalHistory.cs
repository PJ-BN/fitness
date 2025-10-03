using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fitness.Migrations
{
    /// <inheritdoc />
    public partial class AddGoalHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAtUtc",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "DailyCalorieGoal",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DefaultPrivacy",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DisplayName",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "HeightCm",
                table: "AspNetUsers",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MacroCarbsPct",
                table: "AspNetUsers",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MacroFatPct",
                table: "AspNetUsers",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MacroProteinPct",
                table: "AspNetUsers",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PreferredUnits",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TimeZone",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAtUtc",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "WeightKg",
                table: "AspNetUsers",
                type: "numeric",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    EntityType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    EntityId = table.Column<string>(type: "text", nullable: false),
                    Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SnapshotJson = table.Column<string>(type: "text", nullable: true),
                    TimestampUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuditLogs_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DailySummaries",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "text", nullable: false),
                    LocalDate = table.Column<DateOnly>(type: "date", nullable: false),
                    TotalCalories = table.Column<int>(type: "integer", nullable: false),
                    TotalProteinGrams = table.Column<decimal>(type: "numeric(8,2)", nullable: false),
                    TotalCarbsGrams = table.Column<decimal>(type: "numeric(8,2)", nullable: false),
                    TotalFatGrams = table.Column<decimal>(type: "numeric(8,2)", nullable: false),
                    TotalFiberGrams = table.Column<decimal>(type: "numeric(8,2)", nullable: true),
                    TotalSugarGrams = table.Column<decimal>(type: "numeric(8,2)", nullable: true),
                    TotalSodiumMg = table.Column<decimal>(type: "numeric", nullable: true),
                    EntriesCount = table.Column<int>(type: "integer", nullable: false),
                    LastUpdatedUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailySummaries", x => new { x.UserId, x.LocalDate });
                    table.ForeignKey(
                        name: "FK_DailySummaries_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Foods",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    IsSystem = table.Column<bool>(type: "boolean", nullable: false),
                    OwnerUserId = table.Column<string>(type: "text", nullable: true),
                    CaloriesPer100g = table.Column<int>(type: "integer", nullable: false),
                    ProteinGramsPer100g = table.Column<decimal>(type: "numeric(6,2)", nullable: false),
                    CarbsGramsPer100g = table.Column<decimal>(type: "numeric(6,2)", nullable: false),
                    FatGramsPer100g = table.Column<decimal>(type: "numeric(6,2)", nullable: false),
                    FiberGramsPer100g = table.Column<decimal>(type: "numeric(6,2)", nullable: true),
                    SugarGramsPer100g = table.Column<decimal>(type: "numeric(6,2)", nullable: true),
                    SodiumMg = table.Column<decimal>(type: "numeric", nullable: true),
                    Tags = table.Column<string[]>(type: "text[]", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RowVersion = table.Column<byte[]>(type: "bytea", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Foods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Foods_AspNetUsers_OwnerUserId",
                        column: x => x.OwnerUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GoalHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    EffectiveFromDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DailyCalorieGoal = table.Column<int>(type: "integer", nullable: true),
                    MacroProteinPct = table.Column<decimal>(type: "numeric", nullable: true),
                    MacroCarbsPct = table.Column<decimal>(type: "numeric", nullable: true),
                    MacroFatPct = table.Column<decimal>(type: "numeric", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GoalHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GoalHistories_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IntakeEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    FoodId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuantityGrams = table.Column<decimal>(type: "numeric(7,2)", nullable: false),
                    LoggedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LocalDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Source = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntakeEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IntakeEntries_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IntakeEntries_Foods_FoodId",
                        column: x => x.FoodId,
                        principalTable: "Foods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_UserId",
                table: "AuditLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Foods_IsSystem_Name",
                table: "Foods",
                columns: new[] { "IsSystem", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_Foods_Name",
                table: "Foods",
                column: "Name",
                unique: true,
                filter: "\"IsSystem\" = true");

            migrationBuilder.CreateIndex(
                name: "IX_Foods_OwnerUserId_Name",
                table: "Foods",
                columns: new[] { "OwnerUserId", "Name" },
                unique: true,
                filter: "\"OwnerUserId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_GoalHistories_UserId",
                table: "GoalHistories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_IntakeEntries_FoodId",
                table: "IntakeEntries",
                column: "FoodId");

            migrationBuilder.CreateIndex(
                name: "IX_IntakeEntries_UserId_LocalDate",
                table: "IntakeEntries",
                columns: new[] { "UserId", "LocalDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "DailySummaries");

            migrationBuilder.DropTable(
                name: "GoalHistories");

            migrationBuilder.DropTable(
                name: "IntakeEntries");

            migrationBuilder.DropTable(
                name: "Foods");

            migrationBuilder.DropColumn(
                name: "CreatedAtUtc",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DailyCalorieGoal",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DefaultPrivacy",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DisplayName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "HeightCm",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "MacroCarbsPct",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "MacroFatPct",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "MacroProteinPct",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "PreferredUnits",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "TimeZone",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UpdatedAtUtc",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "WeightKg",
                table: "AspNetUsers");
        }
    }
}
