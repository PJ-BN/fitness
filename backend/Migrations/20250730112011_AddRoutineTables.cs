using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Fitness.Migrations
{
    /// <inheritdoc />
    public partial class AddRoutineTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WeeklyRoutines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeeklyRoutines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WeeklyRoutines_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DayRoutines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WeeklyRoutineId = table.Column<int>(type: "integer", nullable: false),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    DayName = table.Column<string>(type: "varchar(50)", nullable: false),
                    IsRestDay = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayRoutines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DayRoutines_WeeklyRoutines_WeeklyRoutineId",
                        column: x => x.WeeklyRoutineId,
                        principalTable: "WeeklyRoutines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DayRoutineBodyParts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DayRoutineId = table.Column<int>(type: "integer", nullable: false),
                    BodyPart = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayRoutineBodyParts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DayRoutineBodyParts_DayRoutines_DayRoutineId",
                        column: x => x.DayRoutineId,
                        principalTable: "DayRoutines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DayRoutineExercises",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DayRoutineId = table.Column<int>(type: "integer", nullable: false),
                    ExerciseId = table.Column<int>(type: "integer", nullable: false),
                    Sets = table.Column<int>(type: "integer", nullable: false),
                    Reps = table.Column<int>(type: "integer", nullable: false),
                    Duration = table.Column<float>(type: "real", nullable: true),
                    Weight = table.Column<float>(type: "real", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayRoutineExercises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DayRoutineExercises_DayRoutines_DayRoutineId",
                        column: x => x.DayRoutineId,
                        principalTable: "DayRoutines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DayRoutineExercises_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DayRoutineBodyParts_DayRoutineId",
                table: "DayRoutineBodyParts",
                column: "DayRoutineId");

            migrationBuilder.CreateIndex(
                name: "IX_DayRoutineExercises_DayRoutineId",
                table: "DayRoutineExercises",
                column: "DayRoutineId");

            migrationBuilder.CreateIndex(
                name: "IX_DayRoutineExercises_ExerciseId",
                table: "DayRoutineExercises",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_DayRoutines_WeeklyRoutineId",
                table: "DayRoutines",
                column: "WeeklyRoutineId");

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyRoutines_UserId",
                table: "WeeklyRoutines",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DayRoutineBodyParts");

            migrationBuilder.DropTable(
                name: "DayRoutineExercises");

            migrationBuilder.DropTable(
                name: "DayRoutines");

            migrationBuilder.DropTable(
                name: "WeeklyRoutines");
        }
    }
}
