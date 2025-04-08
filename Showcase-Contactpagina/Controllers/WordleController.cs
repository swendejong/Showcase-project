using Microsoft.AspNetCore.Mvc;
using System;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Showcase_Contactpagina.Models;

namespace Showcase_Contactpagina.Controllers
{
    public class WordleController : Controller
    {
        
        private readonly HttpClient _httpClient;

        public WordleController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }
        
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult SinglePlayer()
        {
            return View("GameScreen");
        }

        public IActionResult GameScreen()
        {
            return View();
        }

       public static List<User> Users = new();

        private static PasswordHasher<User> passwordHasher = new();


    public ActionResult Register()
    {
        return View("Register");
    }

    [HttpPost]
    public ActionResult Register(string Username, string Email, string Password, string ConfirmPassword)
    {
        // Validate the inputs
        if (Password != ConfirmPassword)
        {
            ViewBag.ErrorMessage = "Passwords do not match.";
        }

        // Check if the username or email already exists
        if (IsUsernameTaken(Username) || IsEmailTaken(Email))
        {
            ViewBag.ErrorMessage = "Username or Email already exists.";
        }

        // Hash the password using PasswordHasher
        var newUser = new User
        {
            Username = Username,
            Email = Email,
            PasswordHash = passwordHasher.HashPassword(null, Password) // Hash the password
        };

        Users.Add(newUser);  // Add to the in-memory list

        // Redirect to login page after successful registration
        return RedirectToAction("Login", "Wordle");
    }

    // Method to check if the username is already taken
    private bool IsUsernameTaken(string username)
    {
        return Users.Any(u => u.Username == username);
    }

    // Method to check if the email is already taken
    private bool IsEmailTaken(string email)
    {
        return Users.Any(u => u.Email == email);
    }

    // GET: Login
    public ActionResult Login()
    {
        return View("Login");
    }

    // POST: Login
    [HttpPost]
    public ActionResult Login(string Username, string Password)
    {
        var user = Users.SingleOrDefault(u => u.Username == Username);

        if (user != null)
        {
            // Verify the password using PasswordHasher
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, Password);

            if (result == PasswordVerificationResult.Success)
            {
                // Successfully logged in, redirect to the dashboard or main page
                return RedirectToAction("Index", "Wordle");
            }
        }

        ViewBag.ErrorMessage = "Invalid username or password.";
        return View("Login");
    }
        // Create a new game
        [HttpPost]
        public async Task<IActionResult> CreateGame()
        {
            // Call API to create a game
            var response = await _httpClient.PostAsync("https://localhost:7278/api/wordle/create", null);

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Failed to create game");
            }

            var gameData = await response.Content.ReadFromJsonAsync<JsonElement>();

            if (gameData.ValueKind != JsonValueKind.Object)
            {
                return BadRequest("Invalid game data.");
            }

            var gameCode = gameData.GetProperty("gameCode").GetString();
            var playerId = gameData.GetProperty("playerId").GetString(); // Ensure API returns this

            if (string.IsNullOrEmpty(gameCode) || string.IsNullOrEmpty(playerId))
            {
                return BadRequest("Missing game data.");
            }

            // Store the gameCode and playerId in TempData to access it on the next page
            TempData["GameCode"] = gameCode;
            TempData["PlayerId"] = playerId;

            // Redirect to the WaitingScreen view with the gameCode
            return View("WaitingScreen", new { gameCode });
        }
        
        public IActionResult JoinGame()
        {
          return View("JoinGame");
        }
        
        public IActionResult ChooseWord()
        {
            return View("ChooseWord");
        }
        
        // Exit the game and return to the home page
        public IActionResult Exit()
        {
            return RedirectToAction("Index", "Home");
        }
    }

    public class User
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; } // Store hashed passwords
    }

}
