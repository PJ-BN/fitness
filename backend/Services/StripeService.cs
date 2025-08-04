
using Fitness.Models;
using Fitness.Models;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class StripeService : IStripeService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;

        public StripeService(IConfiguration configuration, UserManager<User> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
        }

        public async Task<Session> CreateCheckoutSessionAsync(RegisterRequest model, string plan)
        {
            var priceId = plan.ToLower() == "monthly" 
                ? _configuration["Stripe:MonthlyPriceId"] 
                : _configuration["Stripe:YearlyPriceId"];

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        Price = priceId,
                        Quantity = 1,
                    },
                },
                Mode = "subscription",
                SuccessUrl = "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
                CancelUrl = "http://localhost:5173/cancel",
                Metadata = new Dictionary<string, string>
                {
                    { "Email", model.Email },
                    { "Name", model.Name },
                    { "Password", model.Password }, // Note: Storing password in metadata is not recommended for production
                    { "PhoneNumber", model.PhoneNumber }
                }
            };

            var service = new SessionService();
            return await service.CreateAsync(options);
        }

        public async Task<bool> FulfillOrderAsync(Session session)
        {
            var userEmail = session.Metadata["Email"];
            var userName = session.Metadata["Name"];
            var userPassword = session.Metadata["Password"];
            var userPhoneNumber = session.Metadata["PhoneNumber"];

            var user = new User 
            {
                Email = userEmail, 
                UserName = userEmail, 
                Name = userName, 
                PhoneNumber = userPhoneNumber 
            };

            var result = await _userManager.CreateAsync(user, userPassword);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
            }

            return result.Succeeded;
        }
    }
}
