using Microsoft.AspNetCore.Mvc;
using Perfume.Models;
using Perfume.Services;

namespace Perfume.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public async Task<ActionResult<User>> Register(UserRegisterDto request)
        {
            try
            {
                var user = await _authService.Register(request);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            } 
        }

        [HttpPost]
        public async Task<ActionResult<TokenDto>> Login([FromBody]UserLoginDto request)
        {
            try
            {
                var result = await _authService.Login(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            try
            {
                var result = await _authService.RefreshToken(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
