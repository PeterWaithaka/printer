var express = require('express');
var router = express.Router();
var printer = require("node-thermal-printer");


function init (myArray, total_cost, total_payments, receipt_no,  userName, customerName, customerBalance) {
  printer.init({
    type: 'epson',
    interface: '/dev/usb/lp0'
  });

  printer.alignCenter();
  printer.bold(true); 
  printer.println("Paint Shop Naivasha");
  printer.setTextNormal(); 
  printer.println("P.O Box 1700 Naivasha");
  printer.println("Date: "+ new Date());
  printer.println("Mobile: 0700000000" );
  printer.newLine();
  printer.println("Customer:"+ customerName );
  printer.newLine();
  printer.tableCustom([                               // Prints table with custom settings (text, align, width, bold)
    { text: "Product", align:"LEFT", width:0.5, bold:true },
    { text: "Qty", align:"LEFT", width:0.15, bold:true },
    { text: "Price", align:"LEFT", width:0.15, bold:true },
    { text: "Total", align:"LEFT", width:0.15, bold:true }
  ]);

  for(const product of myArray){
    printer.tableCustom([                               // Prints table with custom settings (text, align, width, bold)
      { text: product.Name, align:"LEFT", width:0.5 },
      { text: product.Quantity, align:"LEFT", width:0.15 },
      { text: product.Price, align:"LEFT", width:0.15 },
      { text: product.LineTotal, align:"LEFT", width:0.15 }
    ]);
  }
  printer.newLine();
  printer.println("Total Cost: " + total_cost);
  printer.println("Total Payments: " + total_payments );
  printer.println("Balance: " + customerBalance );
   printer.newLine();
   printer.println("Receipt number: " + receipt_no); 
   printer.partialCut();
 printer.newLine();
  printer.println("Served By: " + userName );
  printer.println("Thanks, Come Again" );
  printer.println("Welcome" );

 
  printer.execute(function (err) {
    if (err) {
      console.error("Print failed", err);
    } else {
      // eslint-disable-next-line
      console.log("Print done");
    }
  });
}

/* GET home page. */

router.get('/', function (req, res) {
  return res.send('Printer interface')
})
router.post('/print', function(req, res, next) {
 var printData = req.body.p_products
 var total_cost = req.body.total_cost;
 var receipt_no = req.body.receipt_no || new Date();
 var total_payments = req.body.total_payments;
 const userName = req.body.userName;
 const customerName = req.body.customerName;
 const customerBalance = req.body.customerBalance;
  init(printData, total_cost, total_payments,receipt_no,  userName, customerName, customerBalance);
  res.send({ state: true});
});

module.exports = router;
