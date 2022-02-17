import asyncio
import os, glob, json

from azure.storage.blob import ContentSettings
from azure.storage.blob.aio import BlobServiceClient, ContainerClient

connection_string = os.environ.get('BLOB_STORAGE_CONNECTION_STRING')
upload_map_files = os.environ.get('UPLOAD_MAP_FILES')

class Storage:
  def __init__(self):
    self._blob_service_client = BlobServiceClient.from_connection_string(
      connection_string,
    )  # type: BlobServiceClient

  def _container_client(self, container: str) -> ContainerClient:
    return self._blob_service_client.get_container_client(container)

  async def upload(self, file_name, js_content, content_type):
    container_client = self._container_client("sites")
    await container_client.upload_blob(
      file_name,
      js_content,
      content_settings=ContentSettings(content_type=content_type),
      overwrite=True
    )
    await container_client.close()
    await self._blob_service_client.close()

async def main():
  f = open('package.json')
  data = json.load(f)
  version = data["version"]
  print(f"Package json version: {version}")
  folder = f"wayke-ecom-web/{version}"

  # JS
  print("Searching for javascript files... ")
  js_file_list = glob.glob('dist-cdn/*.js')
  if (upload_map_files):
    js_file_list.extend(glob.glob('dist-cdn/*.js.map'))

  numJsNotFound = 0
  for file in js_file_list:
    try:
      with open(file, "r") as js_file:
        print(f"Uploading: {file}")
        file_name = file.split("/")[-1]
        print(f"filename: {folder}/{file_name}", )
        await Storage().upload(f"{folder}/{file_name}", js_file.read(), "application/javascript")
    except:
      numJsNotFound += 1
      print(f"Not found: {file}")
  print(f"{len(js_file_list) - numJsNotFound}/{len(js_file_list)} javascript file(s) was uploaded")

  # CSS
  print("Searching for css files... ")
  css_files = glob.glob('dist-cdn/*.css')
  numCssNotFound = 0
  for file in css_files:
    try:
      with open(file, "r") as css_file:
        print(f"Uploading: {file}")
        file_name = file.split("/")[-1]
        print(f"filename: {folder}/{file_name}", )
        await Storage().upload(f"{folder}/{file_name}", css_file.read(), "text/css")
    except:
      print(f"Not found: {file}")
  print(f"{len(css_files) - numCssNotFound}/{len(css_files)} css file(s) was uploaded")

  # FONTS
  print("Searching for font files... ")
  font_files = glob.glob('dist-cdn/*.woff')
  font_files.extend(glob.glob('dist-cdn/*.woff2'))
  numFontsNotFound = 0
  for file in font_files:
    try:
      with open(file, "rb") as font_file:
        print(f"Uploading: {file}")
        file_name = file.split("/")[-1]
        extension = file.split(".")[-1]
        content_type = f"font/{extension}"

        print(f"filename: {folder}/{file_name}", )
        await Storage().upload(f"{folder}/{file_name}", font_file.read(), content_type)
    except Exception as e:
      numFontsNotFound += 1
      print(e)
      print(f"Not found: {file}")
  print(f"{len(font_files) - numFontsNotFound}/{len(font_files)} font file(s) was uploaded")


if __name__ == "__main__":
  print("Uploading files... ")
  asyncio.run(main())
  print("Uploading done!")