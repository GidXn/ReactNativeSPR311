using Core.Interfaces;
using Core.Models.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/[action]")]
public class PostsController(IPostService postService)
    : ControllerBase
{
    /// <summary>
    /// Створити новий пост для поточного авторизованого користувача.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PostCreateModel model)
    {
        var result = await postService.Create(model);
        return Ok(result);
    }

    /// <summary>
    /// Отримати список постів поточного авторизованого користувача.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> List()
    {
        var items = await postService.List();
        return Ok(items);
    }
}


