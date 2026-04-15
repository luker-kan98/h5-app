from unittest.mock import MagicMock, patch


def test_run_scheduler_cycle_uses_session_and_closes_it():
    from app.services.scheduler_daemon import run_scheduler_cycle

    fake_db = MagicMock()
    with patch("app.services.scheduler_daemon.SessionLocal", return_value=fake_db), \
         patch("app.services.scheduler_daemon.run_scheduler_once", return_value={"promoted": 1, "dispatched": 2}) as mock_run:
        result = run_scheduler_cycle()

    assert result == {"promoted": 1, "dispatched": 2}
    mock_run.assert_called_once_with(fake_db)
    fake_db.close.assert_called_once()
