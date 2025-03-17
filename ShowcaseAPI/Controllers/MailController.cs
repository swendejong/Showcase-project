using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Mvc;
using ShowcaseAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ShowcaseAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        
        private readonly IConfiguration _config;

        public MailController(IConfiguration config)
        {
            _config = config;
        } 
        // POST api/<MailController>
        [HttpPost]
        public ActionResult Post([Bind("FirstName, LastName, Email, Phone, Message")] Contactform form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var smtpServer = _config["MailSettings:SmtpServer"];
                var port = int.Parse(_config["MailSettings:Port"]);
                var username = _config["MailSettings:Username"];
                var password = _config["MailSettings:Password"];
                var fromEmail = _config["MailSettings:FromEmail"];
                var fromName = _config["MailSettings:FromName"];

                var client = new SmtpClient(smtpServer, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = "Nieuw contactformulier ontvangen",
                    Body = $"Naam: {form.FirstName} {form.LastName}\n" +
                           $"Email: {form.Email}\n" +
                           $"Telefoon: {form.Phone}\n" +
                           $"Message: {form.Message}\n ",
                    IsBodyHtml = false
                };

                mailMessage.To.Add("swendejong@icloud.com"); 

                client.Send(mailMessage);

                return Ok("E-mail succesvol verzonden");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Er ging iets mis: {ex.Message}");
            }
        }

        [HttpGet]
        public ActionResult Get()
        {
            return Ok("ping");
        }
    }
}
