import requests
res = requests.post('http://127.0.0.1:5000/api/auth/login', json={"email":"nj@gmail.com", "password":"123"})
print("Login:", res.json())
if 'token' in res.json():
    token = res.json()['token']
    me_res = requests.get('http://127.0.0.1:5000/api/auth/me', headers={"Authorization": f"Bearer {token}"})
    print("Me:", me_res.json())
