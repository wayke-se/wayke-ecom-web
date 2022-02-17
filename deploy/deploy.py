import asyncio
import os, glob, json

from azure.storage.blob import ContentSettings
from azure.storage.blob.aio import BlobServiceClient, ContainerClient

async def main():
  f = open('../package.json')
  data = json.load(f)
  version = data["version"]
  print(f"Package json version: {version}")
  folder = f"wayke-ecom-web/{version}"

  print("Searching for javascript files... ")
  js_file_list = glob.glob('dist-cdn/*.js')

  numJsNotFound = 0
  for file in js_file_list:
    try:
      with open(file, "r") as js_file:
        print(f"Uploading: {file}")
        file_name = file.split("/")[-1]
        print(f"filename: {folder}/{file_name}", )
    except:
      numJsNotFound += 1
      print(f"Not found: {file}")
  print(f"{len(js_file_list) - numJsNotFound}/{len(js_file_list)} javascript file(s) was uploaded")

if __name__ == "__main__":
  print("Uploading files... ")
  asyncio.run(main())
  print("Uploading done!")