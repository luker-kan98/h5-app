def test_register_success(client):
    resp = client.post("/auth/register", json={"username": "alice", "password": "pass1234"})
    assert resp.status_code == 200
    assert resp.json()["access_token"]


def test_register_duplicate_username(client):
    client.post("/auth/register", json={"username": "alice", "password": "pass1234"})
    resp = client.post("/auth/register", json={"username": "alice", "password": "otherpass"})
    assert resp.status_code == 409


def test_login_success(client, registered_user):
    resp = client.post("/auth/login", json=registered_user)
    assert resp.status_code == 200
    assert resp.json()["access_token"]


def test_login_wrong_password(client, registered_user):
    resp = client.post("/auth/login", json={"username": "testuser", "password": "wrong"})
    assert resp.status_code == 401


def test_login_unknown_user(client):
    resp = client.post("/auth/login", json={"username": "nobody", "password": "x"})
    assert resp.status_code == 401
