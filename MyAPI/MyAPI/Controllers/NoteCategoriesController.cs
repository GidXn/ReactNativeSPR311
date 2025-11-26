using Core.Interfaces;
using Core.Models.NoteCategory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MyAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]/[action]")]
public class NoteCategoriesController(INoteCategoryService categoryService) 
    : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] NoteCategoryCreateModel model)
    {
        var result = await categoryService.Create(model);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var items = await categoryService.List();
        return Ok(items);
    }
}
