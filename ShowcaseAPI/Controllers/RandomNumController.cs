using Microsoft.AspNetCore.Mvc;
using ShowcaseAPI.Services;

namespace ShowcaseAPI.Controllers;

public class RandomNumController : ControllerBase
{
    private readonly RandomNumberService _randomNumberService;

    public RandomNumController(RandomNumberService randomNumberService)
    {
        _randomNumberService = randomNumberService;
    }

    // GET api/randomnumber/randomsum
    [HttpGet("randomsum")]
    public async Task<ActionResult> GetRandomNumbersSum()
    {
        try
        {
            var (random1, random2, sum) = await _randomNumberService.GetRandomNumbersSumAsync();

            return Ok(new { RandomNumber1 = random1, RandomNumber2 = random2, Sum = sum });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error generating random numbers: {ex.Message}");
        }
    }
}