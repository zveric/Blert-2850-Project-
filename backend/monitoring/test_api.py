import unittest
from datetime import timedelta
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from monitoring.test_models import UserFactory, LivestockFactory, ReadingsFactory

class UserTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()


    def te(self):
        self.assertEqual(True, False)  # add assertion here


class LivestockTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.livestock = LivestockFactory()


    def test_livestock_list(self):
        url = reverse("livestock-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ReadingsAPITests(APITestCase):
    def setUp(self):
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
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["timestamp"], self.r_old.timestamp)







if __name__ == '__main__':
    unittest.main()
