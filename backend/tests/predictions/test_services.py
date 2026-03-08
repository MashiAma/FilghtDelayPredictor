import numpy as np
import pytest

import services.prediction_service as service


# ---- Mock LightGBM models ----
class MockBooster:
    def predict(self, X):
        return np.array([0.8])  # fixed probability


@pytest.fixture(autouse=True)
def mock_models(monkeypatch):
    monkeypatch.setattr(service, "model_dep", MockBooster())
    monkeypatch.setattr(service, "model_columns", ["feature1"])
    monkeypatch.setattr(service, "label_encoders", {})


def test_classify():
    assert service.classify(0.1) == "On-time"
    assert service.classify(0.5) == "Minor"
    assert service.classify(0.9) == "Major"


def test_save_prediction():
    features = {"feature1": 1}

    result = service.save_prediction(features)

    assert result["dep_probability"] == 0.8
    assert result["delay_class_dep"] == "Major"
