
using Fitness.Models;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.IO;
using System.Threading.Tasks;

namespace Fitness.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IStripeService _stripeService;
        private readonly IConfiguration _configuration;

        public PaymentController(IStripeService stripeService, IConfiguration configuration)
        { 
            _stripeService = stripeService;
            _configuration = configuration;
        }

        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] RegisterRequest model, [FromQuery] string plan)
        {
            var session = await _stripeService.CreateCheckoutSessionAsync(model, plan);
            return Ok(new { sessionId = session.Id });
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _configuration["Stripe:WebhookSecret"]);

                                    if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Session;
                await _stripeService.FulfillOrderAsync(session);
            }

            return Ok();
        }
    }
}
