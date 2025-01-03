export const cancelOrd = (body) => {
    const html = `
<table style="width: 100%; background-color: #f9f9f9; padding: 20px;">
<tr>
<td>
<table style="width: 100%; max-width: 800px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; margin: 0 auto; padding: 20px;">
<tr>
<td>
  <h2 style="margin: 0 0 10px; color: #555;">Cancel Order Request</h2>
  <p style="margin: 0 0 15px;">This is to notify you that a user has requested to cancel their order. Below are the details of the request:</p>

  <h3 style="margin: 20px 0 10px; color: #555;">Order Details</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7; font-weight: bold;">Order ID:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${body.id}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7; font-weight: bold;">Order Date:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${new Date(body.orderDate).toDateString()} at ${new Date(body.orderDate).toLocaleTimeString()}</td >
    </tr >
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7; font-weight: bold;">Total Amount:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">£${parseFloat(body.totalAmount) - parseFloat(body.discount) + parseFloat(body.shipFee)}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7; font-weight: bold;">Payment Method:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${body.paymentMethod ? body.paymentMethod : 'Not Defined'}</td>
    </tr>
  </table >

  <h3 style="margin: 20px 0 10px; color: #555;">Customer Details</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7; font-weight: bold;">Customer Name:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${body.shippingDetails.firstName} ${body.shippingDetails.lastName}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7; font-weight: bold;">Email Address:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${body.shippingDetails.email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd; background-color: #f7f7f7; font-weight: bold;">Contact Number:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${body.shippingDetails.phone}</td>
    </tr>
  </table>

  <h3 style="margin: 20px 0 10px; color: #555;">Reason for Cancellation</h3>
  <p style="padding: 10px; background-color: #f7f7f7; border: 1px solid #ddd; border-radius: 4px;">${body.reason}</p>

  <p style="margin: 20px 0 10px;">Please review the cancellation request and take the necessary steps (e.g., refund initiation, restocking, etc.).</p>

  <h3 style="margin: 20px 0 10px; color: #555;">Related Links</h3>
  <p style="margin: 10px 0;">
    <strong>Order Page:</strong> <a href="${process.env.BASE_URL}/admin/orders/${body.id}" style="color: #007bff; text-decoration: none;">Click here to view the order details</a>
  </p>
  <p style="margin: 10px 0;">
    <strong>Invoice:</strong> <a href="${process.env.BASE_URL}${body.invLink}" style="color: #007bff; text-decoration: none;">Click here to view the invoice</a>
  </p>
</td >
</tr >
</table >
</td >
</tr >
</table >`;
    return html
}

export const ordConfirm = (billInfo, invoice) => {
    const html = `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                            <a href="https://puressenceltd.co.uk"> <img src="https://puressenceltd.co.uk/logos/PE-Main-Logo.png"
                            alt="Logo"></a>
                            <h1>Order confirmation from <strong>PurEssence LTD</strong></h1>
                            <h3>Dear ${billInfo.firstName},</h3>
                            <p>Thank you for placing an order with <strong>PurEssence LTD</strong>. We are pleased to confirm
                                the invoice of your order PE-INV-000${invoice.id}.
                            </p>
                            <p>
                                Your order is now being processing and we will contact you as soon as possible. You will receive a notification
                                once your order has been shipped. We appreciate the trust you have placed in us and aim to provide you with the highest quality of service.
                                If you have any questions or need further assistance, please do not hesitate to contact our customer service team at
                                <strong><a href="mailto:info@puressenceltd.co.uk">info@puressenceltd.co.uk</a></strong> or contact on <strong><a href="https://wa.me/+4401254411076">WhatsApp</a></strong>. Thank you for choosing <strong>PurEssence LTD</strong>. We value your 
                                business and look forward to serving you again.
                            </p>
                            <p>To see invoice, <a href="https://puressenceltd.co.uk/invoice?invId=${invoice.id}&ul=${invoice.uniquUrl}">Click</a></p>
                            <h4>Warm regards,</h4>
                            <p> PurEssence LTD.</p>
                    </div>`;
    return html;

}

export const ordPlacedNotify = (billInfo, invoice) => {
    const html = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <h1>Order placed by <strong>${billInfo.firstName} ${billInfo.lastName}</strong></h1>
                    <h2>Client Email: ${billInfo.email}</h2>
                    <h2>Client Phone: ${billInfo.phone}</h2>
                    <h2>Shipping Address: ${billInfo.address}</h2>
                    <h2>Invoice: PE-INV-000${invoice.id}</h2>
                    <h3>Date & Time: ${new Date(invoice.date).toDateString()} ${new Date(invoice.date).toLocaleTimeString()}</h3>
                    <p>To see invoice, <a href="https://puressenceltd.co.uk/invoice?invId=${invoice.id}&ul=${invoice.uniquUrl}">Click</a></p>
            </div>`

    return html;
}

export const ordcancelConfirm = (body) => {
    const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <a href="https://puressenceltd.co.uk">
            <img src="https://puressenceltd.co.uk/logos/PE-Main-Logo.png" alt="Logo" style="max-width: 200px; height: auto; display: block; margin-bottom: 20px;">
        </a>
        <h1>Cancellation Request Received</h1>
        <h3>Dear ${body.shippingDetails.firstName} ${body.shippingDetails.lastName},</h3>
        <p>
            We have received your request to cancel the order with Invoice ID: <strong>PE-INV-000${body.invId}</strong>. 
            Our team is currently reviewing your request and will contact you shortly to guide you through the next steps.
        </p>
        <p>
            We appreciate your patience and understanding. If you have any further questions or need assistance, please do not hesitate to reach out to our customer service team at 
            <strong><a href="mailto:info@puressenceltd.co.uk">info@puressenceltd.co.uk</a></strong> or via <strong><a href="https://wa.me/+4401254411076">WhatsApp</a></strong>.
        </p>
        <p>
            Thank you for choosing <strong>PurEssence LTD</strong>. We are committed to providing you with the best possible service.
        </p>
        <h4>Warm regards,</h4>
        <p>PurEssence LTD.</p>
    </div>`;


    return html
}