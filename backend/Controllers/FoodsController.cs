using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Fitness.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FoodsController : ControllerBase
    {
        private readonly IFoodService _foodService;
        
        public FoodsController(IFoodService foodService)
        {
            _foodService = foodService;
        }
        
        [HttpGet]
        public async Task<ActionResult<ApiResponse<object>>> SearchFoods([FromQuery] FoodSearchDto searchDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var (foods, totalCount) = await _foodService.SearchFoodsAsync(searchDto, userId);
                
                var result = new
                {
                    Foods = foods,
                    TotalCount = totalCount,
                    Page = searchDto.Page,
                    PageSize = searchDto.PageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / searchDto.PageSize)
                };
                
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = result,
                    Message = "Foods retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while searching foods"
                });
            }
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<FoodResponseDto>>> GetFood(Guid id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var food = await _foodService.GetFoodByIdAsync(id, userId);
                
                if (food == null)
                {
                    return NotFound(new ApiResponse<FoodResponseDto>
                    {
                        Success = false,
                        Message = "Food not found"
                    });
                }
                
                return Ok(new ApiResponse<FoodResponseDto>
                {
                    Success = true,
                    Data = food,
                    Message = "Food retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<FoodResponseDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving food"
                });
            }
        }
        
        [HttpPost]
        public async Task<ActionResult<ApiResponse<FoodResponseDto>>> CreateFood([FromBody] FoodDto foodDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var food = await _foodService.CreateFoodAsync(foodDto, userId);
                
                return CreatedAtAction(nameof(GetFood), new { id = food.Id }, 
                    new ApiResponse<FoodResponseDto>
                    {
                        Success = true,
                        Data = food,
                        Message = "Food created successfully"
                    });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<FoodResponseDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<FoodResponseDto>
                {
                    Success = false,
                    Message = "An error occurred while creating food"
                });
            }
        }
        
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<FoodResponseDto>>> UpdateFood(Guid id, [FromBody] FoodDto foodDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var ifMatch = Request.Headers["If-Match"].FirstOrDefault();
                
                if (string.IsNullOrEmpty(ifMatch))
                {
                    return BadRequest(new ApiResponse<FoodResponseDto>
                    {
                        Success = false,
                        Message = "If-Match header is required for updates"
                    });
                }
                
                var food = await _foodService.UpdateFoodAsync(id, foodDto, userId, ifMatch);
                
                if (food == null)
                {
                    return NotFound(new ApiResponse<FoodResponseDto>
                    {
                        Success = false,
                        Message = "Food not found or cannot be modified"
                    });
                }
                
                return Ok(new ApiResponse<FoodResponseDto>
                {
                    Success = true,
                    Data = food,
                    Message = "Food updated successfully"
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new ApiResponse<FoodResponseDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<FoodResponseDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<FoodResponseDto>
                {
                    Success = false,
                    Message = "An error occurred while updating food"
                });
            }
        }
        
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteFood(Guid id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var success = await _foodService.DeleteFoodAsync(id, userId);
                
                if (!success)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Food not found or cannot be deleted"
                    });
                }
                
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Food deleted successfully"
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while deleting food"
                });
            }
        }
        
        [HttpPost("{id}/clone")]
        public async Task<ActionResult<ApiResponse<FoodResponseDto>>> CloneFood(Guid id)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var food = await _foodService.CloneFoodAsync(id, userId);
                
                if (food == null)
                {
                    return NotFound(new ApiResponse<FoodResponseDto>
                    {
                        Success = false,
                        Message = "System food not found"
                    });
                }
                
                return CreatedAtAction(nameof(GetFood), new { id = food.Id }, 
                    new ApiResponse<FoodResponseDto>
                    {
                        Success = true,
                        Data = food,
                        Message = "Food cloned successfully"
                    });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<FoodResponseDto>
                {
                    Success = false,
                    Message = "An error occurred while cloning food"
                });
            }
        }
    }
}