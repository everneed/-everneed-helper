module.exports.nullCleanser = nullCleanser = (variable)=>{
    if(Array.isArray(variable)){
        if(variable.length <= 0) return variable = undefined
            variable.forEach((element, index, array)=>{
            array[index] = nullCleanser(element)
        })
        variable = variable.filter(ele=>{
            if(Array.isArray(ele) && ele.length <= 0) return false
            if(ele != undefined) return true
        })
    }
    else if(typeof variable == "object" && variable != null && !Array.isArray(variable)){
        if(Object.keys(variable).length <= 0) return variable = undefined
        Object.keys(variable).forEach(prop=>{
            variable[prop] = nullCleanser(variable[prop])
            if(variable[prop] == undefined) delete variable[prop]
        })
        // Object.keys(variable).f
        //   if(typeof ele == "object" && ele != null && !Array.isArray(ele) && Object.keys(ele).length <= 0) return false
        //   if(ele != undefined) return true
        // })
        if(Object.keys(variable) <= 0) return variable = undefined
    }
    else if(!variable && typeof variable != "boolean" && typeof variable != "number"){
        variable = undefined
    }
    else if(typeof variable == "string" && variable.length == 0){
    // else if(variable === ""){
        variable = undefined
    }
    return variable
}
module.exports.ensureArray = ensureArray = (suspect)=>{
    if(suspect == undefined) return undefined
    return Array.isArray(suspect) ? suspect : Array(suspect)
}
module.exports.notNull = notNull = (variable)=>{
    const cleaned = nullCleanser(variable)

    if(cleaned == null) return false
    if(cleaned == undefined) return false
    if(typeof cleaned == "object"){
        /* Array */
        if(Array.isArray(cleaned)){
            if(cleaned.length < 1) return false
        }
        /* Object? */
        else if(Object.keys(cleaned).length < 1) return false
    }
    if(typeof cleaned == "number"){
        if(Number.isNaN(cleaned)) return false
    }
    if(typeof cleaned == "string"){
        if(cleaned.length < 1) return false
    }

    return true
}
module.exports.required = required = ({payload, requiredParam})=>{
    /* Usage */
    // required({
    //     payload: <payload :Object>,
    //     requiredParam: [
    //         <param 1 :String>|[<param opt1 :String>, <param opt 2 :String>,...]
    //         ,...
    //     ]
    // })
    
    const error = []
    const normalExistence = requiredParam.filter(x=> typeof x == "string")
    const optionExistence = requiredParam.filter(x=> Array.isArray(x))
    
    /* Normal Param Case */
    if(normalExistence.length){
        const payloadKey = new Set(Object.keys(payload))
        const requiredKey = new Set(requiredParam.filter(x=> typeof x == "string"))
        
        if(requiredKey.intersection(payloadKey).size < requiredKey.size){
            const missingKey = Array(...requiredKey.difference(payloadKey))
            
            error.push(...missingKey)
        }
    }
    /* Option Param Case */
    if(optionExistence.length){
        const payloadKey = new Set(Object.keys(payload))
        const requiredKey = requiredParam.filter(x=> Array.isArray(x))
        
        for(const option of requiredKey){
            const optionKey = new Set(option)

            if(optionKey.intersection(payloadKey).size < 1){
                const missingKey = option.join(" or ")
                
                error.push(missingKey)
            }
            else if(optionKey.intersection(payloadKey).size > 1){
                let missingKey = option.join(" or ")
                missingKey += " (pick either one)"
                
                error.push(missingKey)
            }
        }

    }
    
    if(error.length){
        return {returningObjectError: "Missing required params", missingKey: error.join(", ")}
    }
    else{
        return payload
    }
}

module.exports.pipe = pipe = (value)=>{
    return{
        result: value,
        then: (callback)=>{
            return pipe(callback(value))
        }
    }
}
module.exports.sleep = sleep = ms => new Promise(r => setTimeout(r, ms))

module.exports.randomInt = randomInt = ({min, max})=>{
    return ~~(Math.random() * (max - min) + min)
}
module.exports.randomStr = randomStr = ({ length = 5, powerFactor = {number: 1, lowerAlphabet: 1, upperAlphabet: 1} })=>{
    /* Usage */
    // randomString({
    //     length: <result string length :Number>,
    //     option:{
    //         <"number"|"lowerAlphabet"|"upperAlphabet" :String>: [power factor :Number]
    //         ,...
    //     }
    // })

    let result = ""
    let fuzzy = ""
    const character = {
        number: "0123456789",
        lowerAlphabet: "abcdefghijklmnopqrstuvwxyz",
        upperAlphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }

    /* Process power factor */
    for(const char in powerFactor){
        for(let i = 0;i<powerFactor[char];i++){
            fuzzy += character[char]
        }
    }

    let counter = 0
    while (counter < length) {
        result += fuzzy.charAt(Math.floor(Math.random() * fuzzy.length));
        counter += 1
    }
    return result;
}
module.exports.gacchaExecutioneer = gacchaExecutioneer = (objOption) => {
    /* Usage */
    // gacchaExecutioneer({
    //   <percentage 1-100 :Number>: <any function to run :Function>,
    //   ...
    // })

    /* Description */
    /**
     * Execute returning one from set of functions in random
     * given each chance to be executed in
     * percentage
     */

    const deck = Object.keys(objOption).map(Number)

    // For every given percentage, calculate it per "phase"
    // (a cycle of iteration means a single phase)
    for(let phaseIndex=0; phaseIndex<deck.length; phaseIndex++){
        // Uncount percentage of previous phases
        const accumulatedPercent = deck.reduce((acc, curr, index)=> (index >= phaseIndex) && acc+curr, 0)

        if(getRandomInt({minNumber: 1, maxNumber: accumulatedPercent}) <= deck[phaseIndex]){
            // results
            return objOption[deck[phaseIndex]]
        }
    }
}



module.exports.toRupiah = toRupiah = (number)=>{
    return number.toString().split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
module.exports.upperCaseSentence = upperCaseSentence = ({sentence, removeSpace, strictCase})=>{
    // upperCaseSentence({
    //     sentence: <sentence :String>,
    //     removeSpace: [boolean],
    //     strictCase: [boolean]
    // })
    let result = sentence

    if(strictCase) result = result.toLowerCase()
    if(sentence) result = `${result}`.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
    if(removeSpace) result = result.replace(/\s+/gm, "")
    return result
}
module.exports.typeCaseSentence = typeCaseSentence = ({typeCase, sentence})=>{
    // typeCaseSentence({
    //     typeCase: <"pascal"|"snake"|"dragon"|"camel"|"kebab"|"nocase">
    //     sentence: <sentence :String>
    // })
    let result = sentence.replace(/^\s+|\s+$/g, "").toLowerCase().split(" ")

    switch(typeCase){
        case "pascal":
            result = result
                .map(word=>{
                    return word
                        .split("")
                        .map((letter, index)=> index == 0 ? letter.toUpperCase() : letter)
                        .join("")
                })
                .join("")
        break;
        case "snake":
            result = result.join("_")
        break;
        case "dragon":
            result = result.join("_").toUpperCase()
        break;
        case "camel":
            result = result
                .map((word, index)=>{
                    if(index == 0) return word
                    return word
                        .split("")
                        .map((letter, index)=> index == 0 ? letter.toUpperCase() : letter)
                        .join("")
                })
                .join("")
        break;
        case "kebab":
            result = result.join("-")
        break;
        case "nocase":
            result = result.replace(/\s+/gm, "").toLowerCase()
        break;
    }

    return result
}
module.exports.escape = String.prototype.escape = function(){
    return this.replaceAll(/\n/g, "&#10;")
        .replaceAll(/\!/g, "&excl;")
        .replaceAll(/\"/g, "&quot;")
        .replaceAll(/(?<!^&)#(?![0-9]*;)/g, "&num;")
        .replaceAll(/\$/g, "&dollar;")
        .replaceAll(/\%/g, "&percnt;")
        .replaceAll(/&(?![#]*[a-z]*[0-9]*;)/g, "&amp;")
        .replaceAll(/\'/g, "&apos;")
        .replaceAll(/\(/g, "&lparen;")
        .replaceAll(/\)/g, "&rparen;")
        .replaceAll(/\*/g, "&ast;")
        .replaceAll(/\+/g, "&plus;")
        .replaceAll(/\,/g, "&comma;")
        .replaceAll(/\-/g, "&#45;")
        .replaceAll(/\./g, "&period;")
        .replaceAll(/\//g, "&sol;")
        .replaceAll(/\:/g, "&colon;")
        .replaceAll(/(?<!&[#]*[a-z]*[0-9]*);/g, "&semi;")
        .replaceAll(/\</g, "&lt;")
        .replaceAll(/\=/g, "&equals;")
        .replaceAll(/\>/g, "&gt;")
        .replaceAll(/\?/g, "&quest;")
        .replaceAll(/\@/g, "&commat;")
        .replaceAll(/\[/g, "&lsqb;")
        .replaceAll(/\\/g, "&bsol;")
        .replaceAll(/\]/g, "&rsqb;")
        .replaceAll(/\^/g, "&Hat;")
        .replaceAll(/\_/g, "&lowbar;")
        .replaceAll(/\`/g, "&grave;")
        .replaceAll(/\~/g, "&tilde;")
        .replaceAll(/\€/g, "&euro;")
        .replaceAll(/\‚/g, "&sbquo;")
        .replaceAll(/\¢/g, "&cent;")
        .replaceAll(/\£/g, "&pound;")
        .replaceAll(/\¥/g, "&yen;")
}
module.exports.unescape = String.prototype.unescape = function(){
    return this.replaceAll(/\&#10;/g, "\n")
        .replaceAll(/\&excl;/g, "!")
        .replaceAll(/\&quot;/g, `"`)
        .replaceAll(/\&num;/g, "#")
        .replaceAll(/\&dollar;/g, "$")
        .replaceAll(/\&percnt;/g, "%")
        .replaceAll(/\&amp;/g, "&")
        .replaceAll(/\&apos;/g, "'")
        .replaceAll(/\&lparen;/g, "(")
        .replaceAll(/\&rparen;/g, ")")
        .replaceAll(/\&ast;/g, "*")
        .replaceAll(/\&plus;/g, "+")
        .replaceAll(/\&comma;/g, ",")
        .replaceAll(/\&#45;/g, "-")
        .replaceAll(/\&period;/g, ".")
        .replaceAll(/\&sol;/g, "/")
        .replaceAll(/\&colon;/g, ":")
        .replaceAll(/\&semi;/g, ";")
        .replaceAll(/\&lt;/g, "<")
        .replaceAll(/\&equals;/g, "=")
        .replaceAll(/\&gt;/g, ">")
        .replaceAll(/\&quest;/g, "?")
        .replaceAll(/\&commat;/g, "@")
        .replaceAll(/\&lsqb;/g, "[")
        .replaceAll(/\&bsol;/g, "\\")
        .replaceAll(/\&rsqb;/g, "]")
        .replaceAll(/\&Hat;/g, "^")
        .replaceAll(/\&lowbar;/g, "_")
        .replaceAll(/\&grave;/g, "`")
        .replaceAll(/\&tilde;/g, "~")
        .replaceAll(/\&euro;/g, "€")
        .replaceAll(/\&sbquo;/g, "‚")
        .replaceAll(/\&cent;/g, "¢")
        .replaceAll(/\&pound;/g, "£")
        .replaceAll(/\&yen;/g, "¥")
}
module.exports.switchPourStr = (...words)=>{
    /* Usage */
    // switchPourStr(<word :String>,...)
    let result = ""
    const highestLength = words.toSorted((a, b)=> b.length - a.length)[0].length
    
    for(let i=0; i<highestLength; i++){
        for(const word of words){
            if(i >= word.length) continue
            result += word[i]
        }
    }

    return result
}

module.exports.formatDate = formatDate = (date) => {
    // formateDate({date: <dateObj :Date>})
    const
        now = date ? new Date(date) : new Date(),
        yyyy = now.getFullYear(),
        mm = (now.getMonth()+1).toString().length < 2 ? "0"+(now.getMonth()+1) : now.getMonth()+1,
        dd = (now.getDate()).toString().length < 2 ? "0"+(now.getDate()) : now.getDate()

    return `${dd}-${mm}-${yyyy}`
}   
module.exports.increaseDate = increaseDate = (inc) => {
    // increaseDate(increment :Number)
    const now = new Date()
    return now.setDate(now.getDate()+inc)
}

module.exports.rankedSearch = rankedSearch = ({data, exposedProp, searchQuery}) => {
    /** 
     *  rankedSearchVicnity({
     *      data: <array of object :Array>
     *      exposedProp: [<searchable attribute name :String>,...]
     *      searchQuery: < :String>
     *  })
     * 
     * exposed prop are subject to filter
     */

    /** Stage 0: Resets */
    /**
     * Reset rank point to re-evaluate
     */
    data.forEach(record=> record.rankPoint = 0)
    
    /** Stage 1: Format query into splitted letter array */
    /**
     * clean uppercase letter then split it 
     * into single letters (seperated per word)
     * => ipa ansa
     * => [ipa, aansa]
     * => [[i,p,a], [a,a,n,s,a]]
     */
    let cleansedQuery = searchQuery.toLocaleLowerCase().split(" ")
    let formattedQuery = []
    cleansedQuery.forEach(word=> formattedQuery.push(word.split("")))

    /** Stage 2: Compare letter-to-word */
    /**
     * compare every letter in every word
     * to every existing data record and
     * assign a evaluation points
     */
    data.forEach((record, recordIndex)=>{
        /** recreate data with just only 
         * attributes as stated in exposed props
         * => {roomId, roomName, instituteName, member}
         * => {roomName, instituteName}
         */
        const focusedRecord = {}
        exposedProp.forEach(prop=>{
            focusedRecord[prop] = record[prop]
        })

        /** Stage 3 Comparison */
        /**
         * every search query letter compare
         * and evaluate to exposed datas
         * subjected to filter 
         */
        Object.keys(focusedRecord).forEach(prop=>{
            /**
             * clean uppercase letter then split it 
             * into single letters (seperated per word)
             * => Kelas IX MIPA
             * => [kelas, ix, mipa]
             * => [[k,e,l,a,s], [i,x], [m,i,p,a]]
             */
            const splitWordRecord = focusedRecord[prop].toLocaleLowerCase().split(" ")
            const formattedRecord = []
            splitWordRecord.forEach(word=> formattedRecord.push(word.split("")))
            
            /** For every word of source record */
            formattedRecord.forEach(recordWordArray=>{
                /** For every word of query */
                formattedQuery.forEach(queryWordArray=>{
                    /** Assign rank point if dont have */
                    if(data[recordIndex].rankPoint == undefined) data[recordIndex]["rankPoint"] = 0
                    
                    /** Assign points */
                    data[recordIndex].rankPoint += searchFullMatch({
                        dataWord: recordWordArray,
                        queryWord: queryWordArray
                    })

                    data[recordIndex].rankPoint += searchPositionMatch({
                        dataWord: recordWordArray,
                        queryWord: queryWordArray
                    })

                    data[recordIndex].rankPoint += searchOccurenceMatch({
                        dataWord: recordWordArray,
                        queryWord: queryWordArray
                    })
                })
            })
        })
    })

    return data.sort((a, b) => b.rankPoint - a.rankPoint)
}
module.exports.searchFullMatch = searchFullMatch = ({dataWord, queryWord})=>{
    if(dataWord.join("") == queryWord.join("")) return 10
    return 0
}
module.exports.searchPositionMatch = searchPositionMatch = ({dataWord, queryWord})=>{
    const pointDivider = queryWord.length
    let pointEval = 0
    let localPoint = 0, localPunishment = 0, localDivider = 0
    let matchCounter = 0, faultBehind = 0
    let dataPhase = 0, queryPhase = 0
    let dataIndex = 0, queryIndex = 0

    /** Start phase */
    while(queryPhase < queryWord.length){
        /** Resets */
        queryIndex = queryPhase
        dataIndex = 0
        dataPhase = 0
        localDivider = queryWord.length - queryPhase
        matchCounter = 0
        faultBehind = 0
        localPoint = 0
        localPunishment = 0

        while(queryIndex < queryWord.length){
            
            /** Assign dataIndex to not go lower than saved dataPhase */
            dataIndex = dataPhase
            
            while(dataIndex < dataWord.length){
                if(dataWord[dataIndex] == queryWord[queryIndex]){
                    /** Finds a match!
                     * Add points then lock the current phase
                     */
                    /** Continue iteration */
                    localPoint++
                    matchCounter++
                    dataIndex++
                    
                    /** Save the phase */
                    dataPhase = dataIndex
                    break
                }

                /** If there is a match in the run before
                 * and the current result is faulty, then
                 * add to the faulty score
                 */
                if(matchCounter){
                    faultBehind++
                    localPunishment++
                }

                dataIndex++
            }

            /** Proceed point distribution if
             * the run about to end
             */
            if(queryIndex+1 == queryWord.length){
                pointEval += (localPoint-localPunishment)/(queryWord.length-queryPhase)
            }

            queryIndex++
        }
        
        queryPhase++
    }

    return pointEval/pointDivider
}
module.exports.searchOccurenceMatch = searchOccurenceMatch = ({dataWord, queryWord})=>{
    const pointDivider = dataWord.length
    let pointEval = 0
    /** Dont wanna ruin and splice around the original query */
    let queryReplica = [...queryWord]

    for(const dataIndex in dataWord){
        for(const queryIndex in queryReplica){
            if(dataWord[dataIndex] == queryReplica[queryIndex]){
                pointEval++
                queryReplica.splice(queryIndex, 1)
                break
            }
        }
    }

    return pointEval/pointDivider
}
module.exports.aggregator = aggregator = ({rawObj, primaryCol, concatCol, concatVoluntary})=>{
    // aggregator({
    //     rawObj: <dbRes :Object>
    //     primaryCol: <dbRes id prop :String>
    //     concatCol: [<dbRes obj prop :String>,...]
    //     concatVoluntary: {<concatCol>: [<volunteer value :String>,...],...}
    // })
    const product = {}

    rawObj.forEach(obj=>{
        // create if not exist; primaryCol
        if(!product[obj[primaryCol]]){
            product[obj[primaryCol]] = obj
            
            // check every concatCol
            concatCol.forEach(colname=>{
                // change if not object; concatCol element
                if(typeof product[obj[primaryCol]][colname] != "object"){ //product.PD001.warehouse
                    // change to object
                    product[obj[primaryCol]][colname]

                    // populate related concatCol
                    concatVoluntary[colname].forEach(volunterCol=>{ // concatVoluntary.warehouse @warehouse_stock
                        product[obj[primaryCol]][colname] = {[[obj[colname]]]:{ [volunterCol]: product[obj[primaryCol]][volunterCol] } }  //product.PD001.warehouse.warehouse_stock
                    })
                }
            })
        }
        else{
            // check every concatCol
            concatCol.forEach(colname=>{
                // populate related concatCol
                concatVoluntary[colname].forEach(volunterCol=>{
                    if(!product[obj[primaryCol]][colname][obj[colname]]){
                        product[obj[primaryCol]][colname][obj[colname]] = { [volunterCol]: product[obj[primaryCol]][volunterCol] }  //product.PD001.warehouse.warehouse_stock
                    }
                })
            })
        }

    })

    return product
}