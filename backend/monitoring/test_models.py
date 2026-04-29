
from monitoring.models import User, Livestock, Readings

import factory # for dynamic data https://factoryboy.readthedocs.io/en/stable/index.html

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    username = factory.Sequence(lambda n: f'user_{n}')
    email = factory.Sequence(lambda n: f'user{n}@test.com')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')
    is_active = True


class LivestockFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Livestock
    user = factory.SubFactory(UserFactory)
    site_id = factory.Sequence(lambda n: f'site_{n}')

