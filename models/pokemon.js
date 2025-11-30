import {require} from '../utils.js'
import fs from 'node:fs'
import mongoose from 'mongoose'
//import { v4 as uuidv4 } from 'uuid';
const { MongoClient, ServerApiVersion } = require('mongodb');
const { v4: uuidv4 } = require('uuid');


//import champions from '../data/champion.json' assert { type: 'json' };


const uri = "mongodb+srv://theshakadevirgo:JohnShaka151515@leagueoflegendsclone.dwigeek.mongodb.net/?appName=LeagueOfLegendsClone";
const localurl = 'mongodb://localhost:27017/'

const client = new MongoClient(localurl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dataBase = client.db("LeagueOfLegendsInterface")
const usersCollection = dataBase.collection("users")

//await growthCollection.insertMany(growthRates)

/*mongoose.connect(uri);
const userSchema = new mongoose.Schema({
	name: String,
	password: String, 
})
const User = mongoose.model('user', userSchema);
const newUser = new User({
	name: "Jonathan Lazarte",
	password: "Jonii1543104",
})
newUser.save().then(data => console.log(data))
*/

export class pokemonModel{

		static async getAll({type}){
			
			return reducedPokemon.results
		}

		static async searchByKeys({keys}){
			//const pokemonFiltered = await reducedPokemon?.filter(poke => poke.name.toLowerCase().startsWith(keys));
			return undefined
		}

		static async getSpecies(){
			var species = []
     		 	for(let i = 1; i < 400; i++){
					let pokemon = require(`././data/pokemon-species/${i}/index.json`)
					species.push(pokemon)
				}
			return species
		}

		static async getMoves(movesIndexes){
			var moves = []
			movesIndexes.map(index=>{
				let move = require(`././data/move/${index}/index.json`)
				//move.effect_entries = ""
				move.flavor_text_entries = ""
				move.learned_by_pokemon = ""
				move.names = ""
				move != undefined && moves.push(move)
			})
     		 	/*for(let i = 1; i < 900; i++){
					let move = require(`././data/move/${i}/index.json`)
					move != undefined && moves.push(move)}*/
			return moves
		}

		static async getTypes(){
			var types = []
     		 	for(let i = 1; i < 20; i++){
					let type = require(`././data/type/${i}/index.json`)
					types.push(type)
				}
			const typesIndex = require('././data/type/index.json')
			return {types, typesIndex}			
		}

		static async getChamps(){

			const champs = await require('././data/champion.json')
			return champs.data

		}

		static async getChampionFull(){

			const champ = await require('././data/championFull.json')
			return champ.data

		}

		static async getSkins(){

			const skins = await require('././data/skins_flat.json')
			return skins

		}

}
export class usersModel{

		static async registerUser({body}){
			const foundUser = await usersCollection.findOne({userName: body.userName})

			if(!foundUser){

			await usersCollection.insertOne(body)
			body.campeones = [];
			body.items = [];
			return body

		} else { return {message : "Usuario actualmente registrado"}}

		}

		static async loginUser({body}){

			//const foundUser = usersDB.find(user => user.userName == body.userName && user.password == body.password)
			const user = await usersCollection.findOne(
				{ userName: body.userName, },
				{ projection: { pokemon: 0, items: 0} } 
			)
			console.log(user)
			const { userName : username, password } = body;

		  // Buscar usuario en la base de datos
		  if (!user) {
		    return {
		      success: false,
		      error: 'tus credenciales de inicio de sesión no coinciden con una cuenta en nuestro sistema'
		    };
		  }
		  const verifyPassword = (inputPassword, userPassword) => inputPassword === userPassword 
		  // Verificar contraseña
		  const isPasswordValid = await verifyPassword(password, user.password); // Función ficticia
		  if (!isPasswordValid) {
		    return {
		      success: false,
		      error: 'tus credenciales de inicio de sesión no coinciden con una cuenta en nuestro sistema'
		    };
		  }
		  const generateToken = inputUser => inputUser.id
		  // Si todo es correcto
		  return {
		    success: true,
		    data: {
		      user: { id: user.id, username: user.userName },
		      token: generateToken(user) // Función ficticia para generar token
		    }
		  };
			
		}

		static async verifyToken({token}){
			return token
		}

		static async getUserData({token}){

			//const foundUser = usersDB.find(user => user.userName == body.userName && user.password == body.password)
			const user = await usersCollection.findOne(
			  { id: token }, // Filtro: busca el usuario por su ID
			  { projection: { pokemon: 0, items: 0} } // Proyección: excluye 'pokemon'
			);
			if(user){
				return user
			} else {
				return {message : "Usuario no encontrado"}
			}
			
		}

		static async getAllOwned({id}){
				const result = await usersCollection.findOne(
				  { id: id }, // Filtro: busca el usuario por su ID
				  { projection: { champions: 1, _id: 0 } } // Proyección: trae solo 'pokemon'
				);
				const championsOwneds = result?.champions
					
				return championsOwneds				
		}
		static async addToPokedex({userID, championId, coin, price}){
				//const lastData = await usersCollection.findOne({id: userID})

				//Agregar un nuevo Campeón a un usuario:

				usersCollection.updateOne(
				  { id: userID },
				  { $push: { champions: {'id': championId} } }
				)
				coin == "BE" && usersCollection.updateOne({id: userID}, { $inc: { BE: -price } })
				coin == "RP" && usersCollection.updateOne({id: userID}, { $inc: { RP: -price } })
				//const updatedPokemon = lastData.pokemon.push(finalPokemon) 
				//usersCollection.updateOne({id: userID}, {$set: {pokemon: lastData.pokemon} })
				
				return { id: championId }
		}
		static async sellPokemon({userId, pokemonIndex}){
				
				//Eliminar un Pokémon de un usuario:
				usersCollection.updateOne(
				  { id: userId },
				  { $pull: { pokemon: { index: pokemonIndex } } }
				)

				return {pokemonIndex}
		}
		static async updateLevel({userId, pokeballsState, pokemonExp}){
				//const lastData = await usersCollection.findOne({id: userId}, {projection: {pokemon : 1, _id: 0}})
				const movesToLearn = []
				const pokemonIds = pokeballsState.map(p => {return p.index})
				const lastData = /*(await usersCollection.aggregate([
				  { $match: { id: userId } },
				  {
				    $project: {
				      pokemon: {
				        $filter: {
				          input: "$pokemon",
				          as: "poke",
				          cond: { $in: ["$$poke.index", pokemonIds] }
				        }
				      },
				      _id: 0
				    }
				  },
				  { $limit: 1 } // Asegura que solo se devuelva un documento
				]).toArray())?.[0]?.pokemon;*/ [];

				const getNewMove = async (poke, oldLevel, newLevel) =>{
					const obtainedMoves = []
					/*const apiPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke.id}`).then(response=>response.json())
					const moveToLearn = apiPokemon.moves.filter(move => move.version_group_details[0].level_learned_at < poke.level && move.version_group_details[0].level_learned_at <= newLevel && move.version_group_details[0].move_learn_method.name == "level-up")*/
					const moveToLearn = poke.movesToLearn.filter(move => oldLevel < move.level_learned_at && newLevel >= move.level_learned_at) // Obtener las habilidades que se ganen en los niveles mas alto que el del pokemon, y en los niveles anteriores al del nuevo nivel del pokemon

					for(let i = 0; i < moveToLearn.length; i++){
          const moveUrl = moveToLearn[i].url//moveToLearn[i].move.url
          var apiMove =  await fetch(moveUrl).then(response=>response.json())
          const textIndex = apiMove.flavor_text_entries.findIndex(text => text.language.name == "es") 
          apiMove = {
            ...apiMove,
            pp_state: apiMove.pp,
            flavor_text_entrie: textIndex ? apiMove["flavor_text_entries"][textIndex] : "Indefinido",
            flavor_text_entries: null,
            learned_by_pokemon: null,
            }
          const pokemonNewMove = {
						name: poke.name,
						index: poke.index,
						moveToLearn: apiMove
					}
          await obtainedMoves.push(pokemonNewMove)
        	}
         return obtainedMoves //new Promise(resolve=>resolve())
				}


				const updatedPromises = pokeballsState && pokeballsState?.map(async newState =>{
				//const inputPokemonIndex = lastData?.pokemon?.findIndex(pokemon => pokemon.index == newState.index)
				const inputPokemon = (await usersCollection.findOne(
				  { id: userId, "pokemon.index": newState.index },
				  { projection: { "pokemon.$": 1, _id: 0 } }
				))?.pokemon?.[0] || null;//lastData.pokemon[inputPokemonIndex]

				const finalExp = inputPokemon?.actual_exp + pokemonExp || 0
				const specieUrl = inputPokemon?.species.url.substring(18)
				const growthRate = growthRates.find(gr => gr.pokemon_species.some(pe => pe.url == specieUrl))
				const pokemonLevels = growthRate?.levels?.filter(level => level.experience <= finalExp)
				const pokemonLevel = pokemonLevels?.[pokemonLevels.length -1].level
				/**/
				const movimientosObtenidos = inputPokemon?.level != pokemonLevel ? await getNewMove(inputPokemon, inputPokemon.level, pokemonLevel) : null
				//if(movimientosObtenidos){ for(let i=0; i < movimientosObtenidos.length; i++){   } }
				movimientosObtenidos && movimientosObtenidos.map(obtainedMove=>{
					inputPokemon.moves.length < 4 ? inputPokemon.moves.push(obtainedMove.moveToLearn) : movesToLearn.push(obtainedMove)
				})
				const EVs = {
					hp : newState.hp_effort ? inputPokemon?.EVs.hp + newState.hp_effort : inputPokemon?.EVs.hp ,
					attack : newState.attack_effort ? inputPokemon?.EVs.attack + newState.attack_effort : inputPokemon?.EVs.attack ,
					defense : newState.defense_effort ? inputPokemon?.EVs.defense + newState.defense_effort : inputPokemon?.EVs.defense ,
					special_attack : newState.special_attack_effort ? inputPokemon?.EVs.special_attack + newState.special_attack_effort : inputPokemon?.EVs.special_attack ,
					special_defense : newState.special_defense_effort ? inputPokemon?.EVs.special_defense + newState.special_defense_effort : inputPokemon?.EVs.special_defense ,
					speed : newState.speed_effort ? inputPokemon?.EVs.speed + newState.speed_effort : inputPokemon?.EVs.speed ,
				}

				const hp = Math.floor( ((2 * inputPokemon?.stats[0].base_stat  + inputPokemon?.IVs.hp + EVs.hp / 4) * pokemonLevel) / 100 + pokemonLevel + 10 );
				const attack = Math.floor( ((2 * inputPokemon?.stats[1].base_stat  + inputPokemon?.IVs.attack + EVs.attack / 4) * pokemonLevel) / 100 +  5 );
				const defense = Math.floor( ((2 * inputPokemon?.stats[2].base_stat  + inputPokemon?.IVs.defense + EVs.defense / 4) * pokemonLevel) / 100 + 5 );
				const special_attack = Math.floor( ((2 * inputPokemon?.stats[3].base_stat  + inputPokemon?.IVs.special_attack + EVs.special_attack / 4) * pokemonLevel) / 100 + 5 );
				const special_defense = Math.floor( ((2 * inputPokemon?.stats[4].base_stat  + inputPokemon?.IVs.special_defense + EVs.special_defense / 4) * pokemonLevel) / 100 + 5 );
				const speed = Math.floor( ((2 * inputPokemon?.stats[5].base_stat  + inputPokemon?.IVs.speed + EVs.speed / 4) * pokemonLevel) / 100 + 5 );

				/*return lastData.pokemon[inputPokemonIndex]*/ const newPokemon = {
					...inputPokemon,
					level : pokemonLevel,
					actual_exp : finalExp,
					EVs,
					stats : [
            {...inputPokemon?.stats[0], actual_stat : hp},
            {...inputPokemon?.stats[1], actual_stat : attack},
            {...inputPokemon?.stats[2], actual_stat : defense},
            {...inputPokemon?.stats[3], actual_stat : special_attack},
            {...inputPokemon?.stats[4], actual_stat : special_defense},
            {...inputPokemon?.stats[5], actual_stat : speed}
            		],
					hp_state: newState.hp != undefined ? newState.hp : Math.max(inputPokemon?.stats[0].base_stat, inputPokemon?.hp_state + 100)
				}
				await usersCollection.updateOne(
				    { id: userId, "pokemon.index": newState.index }, // Filtra por usuario y nombre del Pokémon
				    {
				        $set: {
				            "pokemon.$": {
				                ...newPokemon
				                // ... otros campos del Pokémon
				            }
				        }
				    }
				);
				return newPokemon;
			})
				
			const updatedPokemon = await Promise.all(updatedPromises)//pokeballsState && pokeballsState.map(p=> {return lastData.pokemon.find(pokemon=> pokemon.index == p.index)})
			//await usersCollection.updateOne({id: userId}, {$set: {pokemon: lastData.pokemon}})
				
			return {updatedPokemon, movesToLearn}
		}

		static async learnMove({userId, pokemonIndex, moveToLearn, moveToForget}){

    /*const alternativeWay = await usersCollection.findOne({
    	id: userId,
        pokemon: {
            $elemMatch: { index: pokemonIndex } 
        }
    })

    const pokemon = await usersCollection.findOne(
    { id: userId },
    { projection: { pokemon: 1 } }
		);

		const pokemonWay = await usersCollection.findOne(
			{
        id: userId,
        pokemon: {
            $elemMatch: { index: pokemonIndex } // Reemplaza "nombre" por la propiedad única
        }
    },
    { projection: { "pokemon.$": 1 } }
    )*/
		const setString = "pokemon.$.moves." + moveToForget
		usersCollection.updateOne(
		  { id: userId, "pokemon.index": pokemonIndex },
		  { $set: { [`pokemon.$.moves.${moveToForget}`]: moveToLearn } }
		)

		return moveToLearn
		}

		static async buyItem({userId, itemId, price, coin}){
				const lastData = await usersCollection.findOne({id : userId}, {projection : {items: 1, _id: 0}})
				const itemIndexInInventory = lastData.items.findIndex(item => item.id == itemId)
				if(itemIndexInInventory == -1){
					var apiItem = await fetch(`https://pokeapi.co/api/v2/item/${itemId}`).then(response=>response.json())
					apiItem = {
						...apiItem,
						flavor_text_entries : [apiItem.flavor_text_entries[4]] ,
						amount : 1
					}
					lastData.items.push(apiItem)
				} else{
					lastData.items[itemIndexInInventory] = {
						...lastData.items[itemIndexInInventory],
						amount : lastData.items[itemIndexInInventory].amount +1
					}
				}
				usersCollection.updateOne({id: userId}, {$set: { items: lastData.items }});

				coin == "BE" && usersCollection.updateOne({id: userId, BE: {$gte: price}}, { $inc: { BE: -price } })
				coin == "RP" && usersCollection.updateOne({id: userId, RP: {$gte: price}}, { $inc: { RP: -price } })
				return lastData.items
		}

		static async getUserSkins({userID}){
				const userData = await usersCollection.findOne(
				{	id: userID },
				{ projection : {skins: 1, _id: 0} }
				)
				if(userData){
					return userData.skins ? userData.skins : "El usuario aun no cuenta con items"
				} else {
					return "No se ha encontrado el usuario"
				}
		}

}


export class shopModel {
		static async buySkin({userId, skinId, coin, price}){
				const hoy = new Date()

				usersCollection.updateOne(
				  { id: userId },
				  { $push: { skins: {'id': skinId, 'purchaseDate' : hoy } } }
				)

				coin == "BE" && usersCollection.updateOne({id: userId}, { $inc: { BE: -price } })
				coin == "RP" && usersCollection.updateOne({id: userId}, { $inc: { RP: -price } })

				return {id: skinId}
		}
}