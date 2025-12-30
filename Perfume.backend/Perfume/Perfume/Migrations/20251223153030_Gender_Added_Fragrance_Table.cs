using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Perfume.Migrations
{
    /// <inheritdoc />
    public partial class Gender_Added_Fragrance_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Fragrances",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Fragrances");
        }
    }
}
