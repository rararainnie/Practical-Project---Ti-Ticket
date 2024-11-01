import { useState } from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';

function PaymentOptions({ totalAmount, onPaymentComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const generatePromptPayQR = () => {
    const promptPayID = "1234567890";
    return `promptpay://${promptPayID}/${totalAmount}`;
  };

  const handleSubmitCard = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // จำลองการตรวจสอบบัตรเครดิต
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPaymentComplete(true);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromptPayConfirm = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPaymentComplete(true);
    } catch (error) {
      console.error('Payment confirmation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // เพิ่มฟังก์ชันจัดการ card number
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // ลบทุกตัวที่ไม่ใช่ตัวเลข
    
    // เพิ่มขีด (-) อัตโนมัติทุก 4 ตัว
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,4}', 'g')).join('-');
    }
    
    // จำกัดความยาวสูงสุด
    if (value.length <= 19) {
      setCardNumber(value);
    }
  };

  // เพิ่มฟังก์ชันจัดการวันหมดอายุ
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // ลบทุกตัวที่ไม่ใช่ตัวเลข
    
    // เพิ่ม / อัตโนมัติหลังเดือน
    // if (value.length >= 2) {
    //   value = value.slice(0, 2) + '/' + value.slice(2);
    // }
    if (value.length > 0) {
        value = value.match(new RegExp('.{1,2}', 'g')).join('/');
      }
    
    // จำกัดความยาวสูงสุด
    if (value.length <= 5) { // รวม /
      setExpiryDate(value);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-yellow-500 mb-4">เลือกวิธีการชำระเงิน</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              paymentMethod === 'card'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-white'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            บัตรเครดิต/เดบิต
          </button>
          <button
            className={`px-4 py-2 rounded ${
              paymentMethod === 'promptpay'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-white'
            }`}
            onClick={() => setPaymentMethod('promptpay')}
          >
            QR PromptPay
          </button>
        </div>

        {paymentMethod === 'card' && (
          <form onSubmit={handleSubmitCard} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300">หมายเลขบัตร</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="xxxx-xxxx-xxxx-xxxx"
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                required
                maxLength="19"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-300">วันหมดอายุ</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  required
                  maxLength="5"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm text-gray-300">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="xxx"
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  required
                  maxLength="3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300">ชื่อบนบัตร</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name on Card"
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังดำเนินการ...
                </div>
              ) : (
                'ชำระเงิน'
              )}
            </button>
          </form>
        )}

        {paymentMethod === 'promptpay' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={generatePromptPayQR()}
                size={200}
                level="H"
              />
            </div>
            <p className="text-sm text-gray-300">
              สแกน QR Code เพื่อชำระเงิน {totalAmount.toFixed(2)} บาท
            </p>
            <button
              onClick={handlePromptPayConfirm}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังดำเนินการ...
                </div>
              ) : (
                'ยืนยันการชำระเงิน'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

PaymentOptions.propTypes = {
  totalAmount: PropTypes.number.isRequired,
  onPaymentComplete: PropTypes.func.isRequired,
};

export default PaymentOptions; 