using Perfume.Models;

namespace Perfume.Services
{
    public interface IAuthService
    {
        Task<User> Register(UserRegisterDto request);
        Task<TokenDto> Login(UserLoginDto request);
        Task<TokenDto> RefreshToken(RefreshTokenRequestDto request);
    }
}
