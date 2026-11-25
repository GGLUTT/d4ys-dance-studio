namespace Dy4s.E2E;

/// <summary>Test settings. BASE_URL overrides the site under test (default: the studio's production site).</summary>
public static class Env
{
    public static string BaseUrl =>
        (Environment.GetEnvironmentVariable("BASE_URL") ?? "https://www.d4ys-bc.com").TrimEnd('/');
}
