from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    SmallInteger,
    String,
    Table,
    Text,
    text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class RolesPermission(Base):
    __tablename__ = 'roles_permissions'

    id = Column(SmallInteger, primary_key=True, server_default=text("nextval('roles_permissions_id_seq'::regclass)"))
    action_name = Column(String, nullable=False, comment="The action that, when assigned to a role, someone with that role can then perform (ex: delete someone else's post).")


class UserRole(Base):
    __tablename__ = 'user_roles'

    id = Column(SmallInteger, primary_key=True, server_default=text("nextval('user_roles_id_seq'::regclass)"))
    role_name = Column(String)


class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True, server_default=text("nextval('users_id_seq'::regclass)"))
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(Text, nullable=False)
    disabled = Column(Boolean, server_default=text("false"))


class Marker(Base):
    __tablename__ = 'markers'

    id = Column(BigInteger, primary_key=True, server_default=text("nextval('markers_id_seq'::regclass)"))
    created_at = Column(DateTime, nullable=False)
    lat = Column(String, nullable=False)
    long = Column(String, nullable=False)
    media_url = Column(String, nullable=False)
    img_url = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    ingested_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    marker_type = Column(SmallInteger, nullable=False)
    author_id = Column(ForeignKey('users.id', ondelete='RESTRICT'), ForeignKey('users.id'), nullable=False)

    author = relationship('User', primaryjoin='Marker.author_id == User.id')
    author1 = relationship('User', primaryjoin='Marker.author_id == User.id')


t_user_profiles = Table(
    'user_profiles', metadata,
    Column('id', ForeignKey('users.id', ondelete='RESTRICT'), nullable=False, server_default=text("nextval('newtable_id_seq'::regclass)")),
    Column('user_id', BigInteger, nullable=False, comment='User id of the profile owner'),
    Column('social_links', JSONB(astext_type=Text()), comment="Users' Facebook, Instagram, Tik Tok, or Youtube links. NO TWITTER!"),
    Column('profile_pic_url', String, nullable=False, server_default=text("'https://i.imgur.com/nybwm8a.jpeg'::character varying"), comment="URL s to users' profile pictures."),
    Column('profile_description', String, comment='Contains text that users enter to introduce themselves to the community.'),
    comment='Contains information pertaining to user profiles.'
)


t_user_role_assignments = Table(
    'user_role_assignments', metadata,
    Column('id', SmallInteger, nullable=False, server_default=text("nextval('user_role_assignments_id_seq'::regclass)")),
    Column('user_id', ForeignKey('users.id', ondelete='RESTRICT'), nullable=False),
    Column('role_id', ForeignKey('user_roles.id', ondelete='RESTRICT'), nullable=False)
)