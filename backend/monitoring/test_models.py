import random

from django.test import TestCase
from monitoring.models import User, Livestock, Readings, Alerts

import factory  # for dynamic data https://factoryboy.readthedocs.io/en/stable/index.html


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    # Make a basic user profile. With some of the abstract user information
    username = factory.Sequence(lambda n: f"user_{n}")
    email = factory.Sequence(lambda n: f"useremail{n}@test.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    password = factory.PostGenerationMethodCall(
        "set_password", "testpass123"
    )  # Create the password after the user obj is setup. Using hashing to make it more realistic
    is_active = True


class LivestockFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Livestock

    user = factory.SubFactory(UserFactory)
    site_id = factory.Sequence(lambda n: f"site_{n}")


class ReadingsFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Readings

    livestock = factory.SubFactory(LivestockFactory)
    timestamp = factory.Faker("date_time")
    latitude = factory.Faker("latitude")
    longitude = factory.Faker("longitude")
    accel_mag_g = factory.Faker("pyfloat", positive=True, right_digits=2)
    ambient_temperature_c = factory.Faker("pyfloat", positive=True, right_digits=2)
    status = factory.Faker("sentence")

class AlertsFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Alerts
    alert_triggered = factory.LazyFunction(lambda: random.randint(0, 1))
    alert_low_activity = factory.LazyFunction(lambda: random.randint(0, 1))
    alert_geofence = factory.LazyFunction(lambda: random.randint(0, 1))
    alert_flee = factory.LazyFunction(lambda: random.randint(0, 1))


class TestModels(TestCase):
    def test_user_creation(self):
        user = UserFactory()
        self.assertIsNotNone(user.username)
        self.assertTrue(user.username.startswith("user"))

    def test_livestock_creation(self):
        livestock = LivestockFactory()
        self.assertIsNotNone(livestock.site_id)
        self.assertEqual(livestock.site_id[:4], "site")

    def test_readings_creation(self):
        readings = ReadingsFactory()
        self.assertIsNotNone(readings.timestamp)
        self.assertIsNotNone(readings.latitude)
        self.assertIsNotNone(readings.longitude)
        self.assertGreaterEqual(readings.accel_mag_g, 0)
        self.assertGreaterEqual(readings.ambient_temperature_c, 0)
