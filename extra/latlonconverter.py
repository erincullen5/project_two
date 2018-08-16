import requests
from config import gkey
base_url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
pd_dataframe = ##########ENTER PANDAS DATAFRAME NAME HERE###########

lats =[]
lons =[]

for i in range(len(pd_dataframe)):
    url = base_url + pd_dataframe.address1[i] +' '+ pd_dataframe.address2[i] + '&key=' + gkey
    response = requests.get(url).json()

    lats.append(response['results'][0]['geometry']['location']['lat'])
    lons.append(response['results'][0]['geometry']['location']['lng'])


pd_dataframe['latitude']= lats
pd_dataframe['longitude']= lons