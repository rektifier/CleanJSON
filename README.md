# CleanJSON
Visual Studio Code extension to replace data in json structures with default data.

## Before

```json
{
    "test 1":"one",
    "test 2":[
        {
            "some 1":true,
            "some 2": [{
                "secret key 1":"123abc"
            },
            {
                "secret key 2":"123abc"
            }]
        }
    ],
    "test 3": true,
    "test 4": 120221
}
```

#### In Vs Code: Ctrl+Shift+P, "Clean json"

## After
```json
{
  "test 1": "",
  "test 2": [
    {
      "some 1": false,
      "some 2": [
        {
          "secret key 1": ""
        },
        {
          "secret key 2": ""
        }
      ]
    }
  ],
  "test 3": false,
  "test 4": 0
}
```