
using Fitness.Models;
using Stripe.Checkout;

namespace Fitness.Services.Interfaces
{
    public interface IStripeService
    {
        Task<Session> CreateCheckoutSessionAsync(RegisterRequest model, string plan);
        Task<bool> FulfillOrderAsync(Session session);
    }
}
