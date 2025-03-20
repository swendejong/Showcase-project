using Microsoft.AspNetCore.Mvc;
using System;
using System.Text.Json;
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
}
