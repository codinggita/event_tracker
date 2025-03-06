    import razorpay from "razorpay";
    import dotenv from "dotenv"
    dotenv.config();

    export const createRazorpayInstance = () => {
        return  new razorpay({
            key_id:"rzp_test_UPWp28ZHPoz7nU",
            key_secret:"Uew5OFDPM3PjQ6TQRTyMr4MT"
        });
    }

