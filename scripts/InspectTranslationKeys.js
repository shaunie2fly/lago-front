/* eslint no-console: ["error", { allow: ["info", "warn"] }] */
const fs = require('fs')
const path = require('path')

const _ = require('lodash')
const glob = require('glob')
const { GettextExtractor, JsExtractors } = require('gettext-extractor')

const SRC_DIR = './src/'
const TRANSLATION_FILES_PATH = './ditto/base.json' // './ditto/**.json' for when we'll support several languages

/**
 * Get all files which match a given path
 * @param {string} path
 * @returns {string[]}
 */
function getFiles(fromPath) {
  return new Promise((resolve, reject) =>
    glob(fromPath, (error, files) => {
      if (error) {
        reject(error)
        return
      }
      resolve(files)
    })
  )
}

async function extract() {
  // Extract all the translation keys by parsing the 'translate' function
  const extracts = new GettextExtractor()
    .createJsParser([
      JsExtractors.callExpression('translate', {
        arguments: { text: 0 },
      }),
    ])
    .parseFilesGlob(path.join(SRC_DIR, '**/*.@(ts|js|tsx|jsx)'))

  const foundKeys = Object.values(extracts.builder.contexts['']).reduce((acc, extracted) => {
    acc.push(extracted.text)
    return acc
  }, [])

  // Extract all the translation keys not used with 'translate' by matching 'text_[all]'
  const files = await getFiles(path.join(SRC_DIR, '**/*.@(ts|js|tsx|jsx)'))
  const usedKeysWithoutTranslate = files.reduce((acc, file) => {
    const content = fs.readFileSync(file, 'utf-8')
    const usedKeys = content.match(/\'text_(.*?)\'/g)

    if (usedKeys && usedKeys.length) {
      acc = [...acc, ...usedKeys.map((key) => key.replace(/\'/g, ''))]
    }

    return acc
  }, [])

  foundKeys.push(...usedKeysWithoutTranslate)

  const translationFiles = await getFiles(TRANSLATION_FILES_PATH)

  translationFiles.forEach((file) => {
    // Get all translation keys from the ditto file
    const dittoTranslations = JSON.parse(fs.readFileSync(file), 'utf-8')
    const dittoKeys = Object.keys(dittoTranslations)
    const keysNotInDitto = _.uniq(_.difference(foundKeys, dittoKeys))
    const dittoKeysNotUsed = _.uniq(_.difference(dittoKeys, foundKeys))

    if (dittoKeysNotUsed.length || keysNotInDitto.length) {
      if (keysNotInDitto.length) {
        console.info(
          '\u001b[' +
            31 +
            'm' +
            `\n----- Keys used but not defined ----- ${keysNotInDitto.length}` +
            '\u001b[0m'
        )
        console.info(keysNotInDitto.join('\n'))
      }
      if (dittoKeysNotUsed.length) {
        console.info(
          '\u001b[' +
            31 +
            'm' +
            `\n----- Keys defined but not used ----- ${dittoKeysNotUsed.length}` +
            '\u001b[0m'
        )
        console.info(dittoKeysNotUsed.join('\n'))
      }

      throw Error
    } else {
      console.info('\u001b[' + 32 + 'm' + '✔ All good' + '\u001b[0m')
    }
  })
}

/**
 * Extract wrapper
 */
async function main() {
  try {
    await extract()
  } catch (e) {
    console.info('\u001b[' + 31 + 'm' + '\nTranslation check failed' + '\u001b[0m', e)
    process.exit(1)
  }
}

main()
