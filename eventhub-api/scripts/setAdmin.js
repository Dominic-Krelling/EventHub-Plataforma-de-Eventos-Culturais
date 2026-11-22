require('dotenv').config()

const sequelize = require('../config/database')
const User = require('../modules/user/userModel')

async function main() {
  const username = process.argv[2]
  const makeAdmin = process.argv[3] !== 'off'

  if (!username) {
    console.error('Uso: node scripts/setAdmin.js <username> [off]')
    process.exitCode = 1
    return
  }

  try {
    const user = await User.findOne({ where: { username } })

    if (!user) {
      console.error(`Usuário "${username}" não encontrado.`)
      process.exitCode = 1
      return
    }

    await user.update({ isAdmin: makeAdmin })

    console.log(makeAdmin
      ? `"${username}" agora é administrador.`
      : `"${username}" deixou de ser administrador.`)
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error.message)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

main()