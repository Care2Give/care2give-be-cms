import logging
import logging.config
import yaml

def initialise_logging(name):
    with open('logging.yaml', 'r') as file:
        config = yaml.safe_load(file.read())
        logging.config.dictConfig(config)
    return logging.getLogger(name)
