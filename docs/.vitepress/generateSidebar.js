import fs from 'fs'
import path from 'path'

const WHITELIST = ['md', 'daily', 'knowledge', 'blog', 'list-page']
const COLLAPSED = ['DOM', 'JavaScript', 'nestjs', 'vue']
const normalize = (p) => path.posix.normalize(p)

export const cerateJson = () => {
  return new Promise(async (resolve, reject) => {
    // 获取当前模块的 URL
    const rootPath = path.resolve(process.cwd(), process.env.evnpath)
    let sidebar = {}

    async function getSidebar() {
      // 读取文件目录
      let fatherName = await fs.promises.readdir(path.resolve(rootPath))
      fatherName = fatherName.filter((item) => WHITELIST.includes(item))
      fatherName.forEach(async (name) => {
        const fatherPath = path.resolve(rootPath, name)
        return await transfileTree('', name, fatherPath)
      })

      setTimeout(() => {
        resolve(sidebar)
        writeTextFile(
          rootPath + '/.vitepress/output.json',
          JSON.stringify(sidebar)
        )
      }, 2000)
    }
    await getSidebar()

    async function transfileTree(fatherKey, key, cataloguePath) {
      // 遍历目录结构
      const filePath = normalize(path.resolve(rootPath, cataloguePath))
      const fileStat = await fs.promises.stat(filePath)

      if (fileStat.isDirectory()) {
        let chindName = await fs.promises.readdir(path.resolve(cataloguePath))
        return chindName.forEach(async (name) => {
          const chindPath = path.resolve(rootPath, fatherKey, key, name)
          const fatherPathStr = fatherKey ? `${fatherKey}/${key}` : key
          return await transfileTree(fatherPathStr, name, chindPath)
        })
      } else if (
        fileStat.isFile() &&
        filePath.slice(filePath.length - 3, filePath.length) === '.md'
      ) {
        const filename = path.basename(filePath, '.md')
        if (fatherKey.includes('/')) {
          const key1 = fatherKey.split('/')[0]
          const key2 = fatherKey.split('/')[1]
          sidebar[`/${key1}/`] = sidebar[`/${key1}/`] || []
          const childitem = sidebar[`/${key1}/`]
          const child = { text: key2, items: [] }
          if (COLLAPSED.includes(key2)) {
            child.collapsed = false
          }
          if (!childitem.some((i) => i.text === key2)) {
            childitem.push(child)
          }
          childitem.filter((v) => v.text === key2)[0] &&
            childitem
              .filter((v) => v.text === key2)[0]
              .items.push({
                text: filename,
                link: `/${fatherKey}/${filename}`
              })
        } else {
          sidebar[`/${fatherKey}/`] = sidebar[`/${fatherKey}/`] || []
          sidebar[`/${fatherKey}/`].push({
            text: filename,
            link: `/${fatherKey}/${filename}`
          })
        }
      }
    }
  })
}

export const sidebarJSON = await cerateJson()

// writeTextFile('output.json', JSON.stringify(sidebar))
function writeTextFile(filename, content) {
  fs.writeFile(filename, content, (err) => {
    if (err) {
      console.error('Failed to write file:', err)
    } else {
      console.log('File written successfully.')
    }
  })
}
