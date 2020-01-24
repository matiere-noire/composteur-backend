import React from 'react'
import { hydraDataProvider as baseHydraDataProvider, fetchHydra as baseFetchHydra } from '@api-platform/admin'
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation'
import { Redirect } from 'react-router-dom'

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

const entrypoint = process.env.REACT_APP_API_ENTRYPOINT
const fetchHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })
const fetchHydra = (url, options = {}) =>
  baseFetchHydra(url, {
    ...options,
    headers: new Headers(fetchHeaders())
  })
const apiDocumentationParser = entrypoint =>
  parseHydraDocumentation(entrypoint, { headers: new Headers(fetchHeaders()) }).then(
    ({ api }) => ({ api }),
    result => {
      switch (result.status) {
        case 401:
          return Promise.resolve({
            api: result.api,
            customRoutes: [
              {
                props: {
                  path: '/',
                  render: () => <Redirect to={'/login'} />
                }
              }
            ]
          })

        default:
          return Promise.reject(result)
      }
    }
  )

const baseDataProvider = baseHydraDataProvider(entrypoint, fetchHydra, apiDocumentationParser)
const dataProvider = {
  ...baseDataProvider,
  create: (resource, params) => {
    // TODO Il faut trouver comment sortir de la boucle inifi
    if (resource === 'media_objects' && params.data.media_objects && params.data.media_objects.file) {
      // Freshly dropped pictures are File objects and must be converted to base64 strings
      const newPicture = params.data.media_objects.rawFile

      return convertFileToBase64(newPicture)
        .then(base64Picture => ({
          data: base64Picture,
          imageName: newPicture.name
        }))
        .then(transformedNewPicture => {
          return baseDataProvider.create(resource, {
            ...params,
            data: transformedNewPicture
          })
        })
    }
    // Ici c'est le default
    return baseDataProvider.create(resource, params)
  }
}

export default dataProvider
