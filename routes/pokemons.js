import {Router} from 'express'
import {pokemonController, usersController, shopController} from '../controllers/pokemon.js'



export const pokedexRouter = Router()

export const shopRouter = Router()




pokedexRouter.get('/', pokemonController.getAll)

pokedexRouter.get('/:keys', pokemonController.searchByKeys)

pokedexRouter.get('/data/species', pokemonController.getSpecies)

pokedexRouter.post('/data/moves', pokemonController.getMoves)

pokedexRouter.get('/data/types', pokemonController.getTypes)

pokedexRouter.post('/auth/register', usersController.registerUser)

pokedexRouter.post('/auth/login', usersController.loginUser)

pokedexRouter.post('/auth/verify', usersController.verifyToken)

pokedexRouter.post('/users/getUserData', usersController.getUserData)

pokedexRouter.post('/users/pokemon', usersController.getAllOwned)

pokedexRouter.post('/users/addpokemon', usersController.addToPokedex)

pokedexRouter.post('/users/sellpokemon', usersController.sellPokemon)

pokedexRouter.post('/users/updatelevel', usersController.updateLevel)

pokedexRouter.post('/users/learnmove', usersController.learnMove)

pokedexRouter.post('/users/skins', usersController.getUserSkins)

pokedexRouter.get('/data/getchamps', pokemonController.getChamps)

pokedexRouter.get('/data/championFull', pokemonController.getChampionFull)

pokedexRouter.get('/data/skins', pokemonController.getSkins)

/*shopRouter.post('/:type/:productId', shopController.buySkin)*/

shopRouter.post('/skin', shopController.buySkin)