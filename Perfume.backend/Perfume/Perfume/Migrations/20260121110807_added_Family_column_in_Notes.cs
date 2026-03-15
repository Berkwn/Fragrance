using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Perfume.Migrations
{
    /// <inheritdoc />
    public partial class added_Family_column_in_Notes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Family",
                table: "Notes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Family",
                table: "Notes");
        }
    }
}
