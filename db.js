import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';
const Conn = new Sequelize(
  'relay',
  'root',
  'root',
  {
    dialect: 'mysql',
    host: 'localhost'
  }
);

const Person = Conn.define('person', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

const Post = Conn.define('post', {
  title: {
    type: Sequelize.STRING,
    allowNull:false
  },
  content: {
    type: Sequelize.STRING,
    allowNull:false
  }
});

Person.hasMany(Post);
Post.belongsTo(Person);

Conn.sync({force:true}).then(()=>{
  _.times(10, ()=>{
    return Person.create({
      firstName: Faker.name.firstName(),
      lastname: Faker.name.lastName(),
      email: Faker.internet.email()
    }).then(person =>{
       return person.createPost({
         title: 'Sample title by ${person.firstName}',
         content: 'This is a sample article'
       });
    });
  });
});

export default Conn;
