import qrcode
from pathlib import Path

upi_id = '6202910742@fam'
pay_uri = f'upi://pay?pa={upi_id}&pn=Project%20Athena&cu=INR'
output_path = Path('public/upi-qr.png')

qr = qrcode.QRCode(
    version=4,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=4,
)
qr.add_data(pay_uri)
qr.make(fit=True)
img = qr.make_image(fill_color='black', back_color='white')
output_path.parent.mkdir(parents=True, exist_ok=True)
img.save(output_path)
print('Saved', output_path.resolve())
print('URI:', pay_uri)
