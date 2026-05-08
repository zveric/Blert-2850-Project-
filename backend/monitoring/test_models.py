# Copilot AI was used to read documentation surrounding Django testing and factory_boy.
# These tests were then written following these non-specific instructions (it took ages)


import random
from django.test import TestCase
from monitoring.models import User, Livestock, Readings, Alerts
import factory
import unittest
from datetime import timedelta
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from monitoring.models import Readings


class UserFactory(factory.django.DjangoModelFactory): # Generates users using fake data
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user_{n}")
    email = factory.Sequence(lambda n: f"useremail{n}@test.com")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    password = factory.PostGenerationMethodCall("set_password", "testpass123")
    is_active = True


class LivestockFactory(factory.django.DjangoModelFactory): #Generates Livestock using fake data
    class Meta:
        model = Livestock

    user = factory.SubFactory(UserFactory)
    site_id = factory.Sequence(lambda n: f"site_{n}")


class ReadingsFactory(factory.django.DjangoModelFactory): #Generates readings using fake data
    class Meta:
        model = Readings

    livestock = factory.SubFactory(LivestockFactory)
    timestamp = factory.LazyFunction(timezone.now) # fix for the timezone error
    latitude = factory.Faker("latitude")
    longitude = factory.Faker("longitude")
    accel_mag_g = factory.Faker("pyfloat", positive=True, right_digits=2)
    ambient_temperature_c = factory.Faker("pyfloat", positive=True, right_digits=2)
    status = factory.Faker("sentence")


class AlertsFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Alerts

    readings = factory.SubFactory(ReadingsFactory)
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

    def test_alerts_creation(self):
        alerts = AlertsFactory()
        self.assertIsNotNone(alerts.readings)
        self.assertIn(alerts.alert_triggered, [0, 1])
        self.assertIn(alerts.alert_low_activity, [0, 1])
        self.assertIn(alerts.alert_geofence, [0, 1])
        self.assertIn(alerts.alert_flee, [0, 1])


    def test_user_password_is_hashed(self):
        user = UserFactory()
        self.assertTrue(user.check_password("testpass123"))
        self.assertFalse(user.check_password("wrongpassword"))

    def test_each_user_gets_a_unique_username(self):
        user1 = UserFactory()
        user2 = UserFactory()
        self.assertNotEqual(user1.username, user2.username)

    def test_livestock_is_linked_to_a_user(self):
        livestock = LivestockFactory()
        self.assertIsNotNone(livestock.user)
        self.assertIsInstance(livestock.user, User)

    def test_each_livestock_gets_a_unique_site_id(self):
        livestock1 = LivestockFactory()
        livestock2 = LivestockFactory()
        self.assertNotEqual(livestock1.site_id, livestock2.site_id)

    def test_reading_is_linked_to_livestock(self):
        reading = ReadingsFactory()
        self.assertIsNotNone(reading.livestock)
        self.assertIsInstance(reading.livestock, Livestock)

    def test_reading_latitude_and_longitude_are_valid(self):
        reading = ReadingsFactory()
        self.assertGreaterEqual(float(reading.latitude), -90)
        self.assertLessEqual(float(reading.latitude), 90)
        self.assertGreaterEqual(float(reading.longitude), -180)
        self.assertLessEqual(float(reading.longitude), 180)

    def test_deleting_livestock_deletes_its_readings(self):
        livestock = LivestockFactory()
        ReadingsFactory(livestock=livestock)
        ReadingsFactory(livestock=livestock)
        self.assertEqual(Readings.objects.count(), 2)
        livestock.delete()
        self.assertEqual(Readings.objects.count(), 0)

    def test_alert_is_linked_to_a_reading(self):
        alert = AlertsFactory()
        self.assertIsNotNone(alert.readings)
        self.assertIsInstance(alert.readings, Readings)

    def test_only_one_alert_per_reading(self):
        reading = ReadingsFactory()
        AlertsFactory(readings=reading)
        with self.assertRaises(Exception):
            AlertsFactory(readings=reading)


class UserTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)


    def test_register_create_new_user(self):
        response = self.client.post("/api/register/", {"username": "newuser", "password": "pw12345!"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_user_exists(self):
        UserFactory(username="eric")
        response = self.client.post("/api/register/", {"username": "eric", "password": "secret"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LivestockTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.livestock = LivestockFactory()
        self.client.force_authenticate(user=self.user)


    def test_livestock_list(self):
        url = reverse("livestock-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ReadingsAPITests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.livestock_a = LivestockFactory()
        self.livestock_b = LivestockFactory()

        now = timezone.now()

        # Create some readings with different timestamps for the two livestock
        self.r_old = ReadingsFactory(
            livestock=self.livestock_a,
            timestamp=now - timedelta(hours=3)
        )
        self.r_mid = ReadingsFactory(
            livestock=self.livestock_a,
            timestamp=now - timedelta(hours=2)
        )
        self.r_new = ReadingsFactory(
            livestock=self.livestock_b,
            timestamp=now - timedelta(hours=1)
        )
    def test_readings_list(self):
        url = reverse("readings-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_readings_filter_by_livestock(self):
        url = reverse("readings-list")
        response = self.client.get(url, {"livestock": self.livestock_a.id }) # Get 2 latest readings for livestock_a
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Should return 2 readings for livestock_a

    def test_readings_get_by_timestamp(self):
        url = reverse("readings-list")
        response = self.client.get(url, {"timestamp": self.r_old.timestamp})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_readings_empty_list_if_no_data(self):
        Readings.objects.all().delete()
        url = reverse("readings-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_readings_limit_parameter_limits(self):
        url = reverse("readings-list")
        response = self.client.get(url, {"limit": 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_readings_are_returned_newest_first(self):
        url = reverse("readings-list")
        response = self.client.get(url)
        timestamps = [r["timestamp"] for r in response.data]
        self.assertEqual(timestamps, sorted(timestamps, reverse=True))

    def test_readings_filter_by_end_time(self):
        url = reverse("readings-list")
        cutoff = (timezone.now() - timedelta(hours=2, minutes=30)).isoformat()
        response = self.client.get(url, {"end_time": cutoff})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.r_old.id)


if __name__ == '__main__':
    unittest.main()
