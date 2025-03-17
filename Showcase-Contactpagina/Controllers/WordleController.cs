using Microsoft.AspNetCore.Mvc;
using System;

namespace Showcase_Contactpagina.Controllers
{
    public class WordleController : Controller
    {
        // =======================
        // MAIN GAME SCREEN (Index)
        // =======================
        public IActionResult Index()
        {
            return View(); // Load the main game screen (menu)
        }

        // ========================
        // SINGLE PLAYER GAME
        // ========================
        public IActionResult SinglePlayer()
        {
            // Redirect to the shared game screen for single-player
            return View("GameScreen");
        }

        // ========================
        // CREATE GAME
        // ========================
        public IActionResult CreateGame()
        {
            // Generate a random 6-digit game code for the game
            Random random = new Random();
            string gameCode = random.Next(100000, 999999).ToString();

            // Store the game code in ViewData to be displayed on the waiting screen
            ViewData["GameCode"] = gameCode;

            // Redirect to the waiting screen where the game creator waits for another player
            return View("WaitingScreen");
        }

        // ========================
        // JOIN GAME
        // ========================
        public IActionResult JoinGame()
        {
            // Load the screen where players enter the game code to join an existing game
            return View("JoinGame");
        }

        // Handle the submission of the game code by the joining player
        [HttpPost]
        public IActionResult SubmitGameCode(string gameCode)
        {
            if (!string.IsNullOrEmpty(gameCode))
            {
                // Redirect to the game screen with the game code for multiplayer
                return RedirectToAction("GameScreen", new { code = gameCode });
            }

            // If no game code is entered, reload the join game screen
            return View("JoinGame");
        }

        // ========================
        // GAME SCREEN (SINGLE PLAYER + MULTIPLAYER)
        // ========================
        // For now, this is the same screen for both single-player and multiplayer games.
        public IActionResult GameScreen(string code = null)
        {
            // If it's a multiplayer game, the game code will be available in the URL
            if (!string.IsNullOrEmpty(code))
            {
                ViewData["GameCode"] = code; // Display the game code for the multiplayer game
            }

            // Load the game screen
            return View("GameScreen");
        }

        // ========================
        // WORD CHOICE FOR MULTIPLAYER
        // ========================
        // Displays the screen where players will choose their word before the game starts
        public IActionResult ChooseWord()
        {
            return View("ChooseWordScreen"); // Render the word choice screen
        }

        // Handle the POST action when a player submits their chosen word
        [HttpPost]
        public IActionResult ChooseWord(string player1Word)
        {
            // Save the player's chosen word, for now using TempData or a session variable
            TempData["Player1Word"] = player1Word;

            // Redirect to the waiting screen (Waiting for other player)
            return RedirectToAction("Waiting");
        }

        // ========================
        // WAITING SCREEN
        // ========================
        // Display the screen while waiting for the other player to join or make their choice
        public IActionResult Waiting()
        {
            // This can include logic to show whether the other player has joined or is choosing their word
            return View("WaitingScreen");
        }

        // ========================
        // EXIT GAME
        // ========================
        // Handles the exit action (either back to the home screen or back to the main menu)
        public IActionResult Exit()
        {
            return RedirectToAction("Index", "Home"); // Redirect to the home page
        }
    }
}
