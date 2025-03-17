namespace ShowcaseAPI.Services;


public class RandomNumberService
{
    public async Task<(int RandomNumber1, int RandomNumber2, int Sum)> GetRandomNumbersSumAsync()
    {
        try
        {
            // Generate two random numbers asynchronously
            var random1Task = Task.Run(() => new Random().Next(1, 100));  // Random number between 1 and 100
            var random2Task = Task.Run(() => new Random().Next(1, 100));  // Random number between 1 and 100

            // Wait for both tasks to complete
            await Task.WhenAll(random1Task, random2Task);

            // Calculate the sum
            int sum = random1Task.Result + random2Task.Result;

            return (random1Task.Result, random2Task.Result, sum);
        }
        catch (Exception ex)
        {
            throw new Exception("Error generating random numbers: " + ex.Message);
        }
    }
}