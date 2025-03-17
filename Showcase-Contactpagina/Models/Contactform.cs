using System.ComponentModel.DataAnnotations;

namespace Showcase_Contactpagina.Models
{
    public class Contactform
    {
        [Required]
        [StringLength(60)]
        public string FirstName {  get; set; }

        [Required]
        [StringLength(60)]
        public string LastName {  get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string Phone { get; set; }
        
        [Required]
        [StringLength(600, MinimumLength = 10, ErrorMessage = "Het bericht moet tussen 10 en 600 tekens lang zijn.")]
        public string Message { get; set; }
    }
}
