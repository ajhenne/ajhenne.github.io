import json
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean

## Add a search for pokemon.json and update it.
## Source: supereffective.gg github table.

####
# LOAD JSON
with open('archive/pokemon.json', 'r') as j:
    data = json.loads(j.read())

columns_to_keep = ['id', 'nid', 'dexNum', 'formId', 'name', 'abilities']

filtered_data = [{column: record[column] for column in columns_to_keep if column in record} for record in data]

for row in filtered_data:
    if row['abilities']['hidden'] == None:
        row['abilities'] = row['abilities']['primary']
        row['has_hidden'] = False
    else:
        row['abilities'] = row['abilities']['hidden']
        row['has_hidden'] = True

####
# LOAD SQL
engine = create_engine('sqlite:///database.db')
meta = MetaData()
meta.create_all(engine)

# Create table.
pokemon_table = Table('pokemon', meta,
                    Column('internalId', Integer, primary_key=True, autoincrement=True),
                    Column('id', String),
                    Column('nid', String),
                    Column('dexNum', Integer),
                    Column('name', String),
                    Column('formId', String),
                    Column('has_hidden', Boolean),
                    Column('abilities', String))

pokemon_table.create(engine)

# Load data.
with engine.connect() as conn:
    for row in filtered_data:
        insert_query = pokemon_table.insert().values(dexNum=row['dexNum'],
                                                id=row['id'],
                                                nid=row['nid'],
                                                name=row['name'],
                                                formId=row['formId'],
                                                has_hidden=row['has_hidden'],
                                                abilities=row['abilities'])
        conn.execute(insert_query)
    
    conn.commit()
    conn.close()

print("Success rewriting table.")


# next create engine and make into sql db
# then create search form
# as user type it searches through db for name
# can show name + sprite
# if user select then add this row to db