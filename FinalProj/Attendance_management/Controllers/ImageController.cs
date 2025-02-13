using Microsoft.AspNetCore.Mvc;

namespace Attendance_management.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly string _imageFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

        public ImageController(ILogger<ImageController> logger)
        {
            if (!Directory.Exists(_imageFolderPath))
            {
                Directory.CreateDirectory(_imageFolderPath);
            }

        }



        [HttpGet("Get/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var filePath = Path.Combine(_imageFolderPath, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found.");

            var imageFileStream = System.IO.File.OpenRead(filePath);
            return File(imageFileStream, "image/jpeg");
        }





        [HttpPost("Upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded.");

                // Validate file type (only JPG allowed)
                if (Path.GetExtension(file.FileName).ToLower() != ".jpg")
                    return BadRequest("Only JPG files are allowed.");

                // Save the file to the uploads folder
                var fileName = file.FileName;
                var filePath = Path.Combine(_imageFolderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new { fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An internal error occurred.");
            }
        }



    }
}
